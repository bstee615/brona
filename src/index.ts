import * as rendering from "./rendering";

import * as brona from "./brona";

import * as tiles from "./tiles";
import Sprite from "./sprite";
import { canvas } from "./rendering";
import { mousedown, mousePosition, rightMousedown } from "./control";

tiles.loadTile(0, 13, "Mushroom");
tiles.loadTile(0, 13, "Mushroom", 0, 1);
tiles.loadTile(6, 0, "Pine_1", 2, 4);
tiles.loadTile(7, 0, "Pine_2", 2, 5);
tiles.loadTile(6, 1, "Pine_3", 3, 4);
tiles.loadTile(7, 1, "Pine_4", 3, 5);

tiles.loadObject(0, 6, "Pit_1_1", 5, 5, 1, 1, true);
tiles.loadObject(0, 7, "Pit_2_1", 6, 5, 1, 1, true);
tiles.loadObject(0, 8, "Pit_3_1", 7, 5, 1, 1, true);
tiles.loadObject(1, 6, "Pit_1_2", 5, 6, 1, 1, true);
tiles.loadObject(1, 7, "Pit_2_2", 6, 6, 1, 1, true);
tiles.loadObject(1, 8, "Pit_3_2", 7, 6, 1, 1, true);
tiles.loadObject(2, 6, "Pit_1_3", 5, 7, 1, 1, true);
tiles.loadObject(2, 7, "Pit_2_3", 6, 7, 1, 1, true);
tiles.loadObject(2, 8, "Pit_3_3", 7, 7, 1, 1, true);

const bg = new Sprite("forest.png");

function renderLoopStep() {
    // Clear canvas
    rendering.ctx.clearRect(0, 0, rendering.canvas.clientWidth, rendering.canvas.clientHeight);
    
    // Draw background image
    bg.draw(rendering.ctx, 0, 0, rendering.canvas.clientWidth, rendering.canvas.clientHeight);

    // Draw loaded tiles
    for (const tile of tiles.tiles) {
        tile.draw(rendering.ctx);
    }

    // Draw Brona
    brona.obj.draw(rendering.ctx);
}

let casting = false;

class Fade {
    private range: any;
    private inc: number;

    private currentValue: number;
    private accelFactor: number;
    private doneFading: boolean;

    get value() {
        return this.currentValue;
    }

    set value(input) {
        this.currentValue = input;
    }

    get done() {
        return this.doneFading;
    }

    constructor(min, max, inc, accelFactor = 1) {
        this.range = {
            min,
            max
        };
        this.inc = inc;
        this.accelFactor = accelFactor;
        this.reset();
    }

    increment() {
        if (this.doneFading) {
            return;
        }

        this.currentValue += this.inc;
        this.inc = this.inc * this.accelFactor;

        if (this.inc > 0) {
            if (this.currentValue >= this.range.max) {
                this.currentValue = this.range.max;
                this.doneFading = true;
            }
        }
        else {
            if (this.currentValue <= this.range.min) {
                this.currentValue = this.range.min;
                this.doneFading = true;
            }
        }
    }
    
    reset() {
        if (this.inc > 0) {
            this.currentValue = this.range.min;
        }
        else {
            this.currentValue = this.range.max;
        }
        this.doneFading = false;
    }
};
let colorFade = new Fade(0.2, 0.6, 0.01);
let reverseColorFade = new Fade(0, 0.6, -0.01);
reverseColorFade.value = 0;
let timeFade = new Fade(0.05, 1, -0.1, 0.9);

let positions = [];

import Tesseract from 'tesseract.js';

let successfulSpellLetters = [];

function saveSpell() {
    let memoryCanvas = document.createElement("canvas");
    memoryCanvas.width = rendering.canvas.width;
    memoryCanvas.height = rendering.canvas.height;

    let memoryCtx = memoryCanvas.getContext("2d");

    memoryCtx.strokeStyle = "white";
    memoryCtx.fillStyle = "white";
    memoryCtx.fillRect(0, 0, memoryCanvas.width, memoryCanvas.height);

    memoryCtx.beginPath();
    memoryCtx.lineWidth = 30;
    memoryCtx.strokeStyle = "orange";
    if (positions.length > 0) {
        memoryCtx.moveTo(positions[0].x, positions[0].y);
        for (const pos of positions) {
            memoryCtx.lineTo(pos.x, pos.y);
        }
    }
    memoryCtx.stroke();
    
    // const img = document.createElement("img");
    // img.src = memoryCanvas.toDataURL();
    // document.body.appendChild(img);

    document.getElementById("spell-display").innerHTML = "Thinking...";
    Tesseract.recognize(
        memoryCanvas
    ).then((result) => {
        successfulSpellLetters.push(result.text);
    });
    // alert(string);
}

// Casting handlers

let castingTimeout = null;
canvas.addEventListener("mousedown", function(ev) {
    if (ev.button == 2) {
        casting = true;
        if (castingTimeout) {
            clearTimeout(castingTimeout);
        }
        castingTimeout = null;
    }
});

canvas.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    return false;
}, false);

canvas.addEventListener("mousedown", function(ev) {
    if (ev.button == 2) {
        positions = [];
    }
});
canvas.addEventListener("mousemove", function(ev) {
    if (casting && rightMousedown) {
        positions.push({x: ev.offsetX, y: ev.offsetY});
    }
});
canvas.addEventListener("mouseup", function(ev) {
    if (ev.button == 2) {
        if (casting) {
            saveSpell();
            positions = [];
            castingTimeout = setTimeout(function() {
                casting = false;
            }, 1000);
        }
    }
});

// Movement handlers
canvas.addEventListener("mousedown", function(ev) {
    if (ev.button == 0) {
        brona.target(mousePosition.x, mousePosition.y);
    }
});
canvas.addEventListener("mousemove", function() {
    if (mousedown) {
        brona.target(mousePosition.x, mousePosition.y);
    }
});

function castingLoop() {
    brona.movementLoopStep(timeFade.value);
    timeFade.increment();
    renderLoopStep();
    
    // Fade to black
    const originalAlpha = rendering.ctx.globalAlpha;
    rendering.ctx.globalAlpha = colorFade.value;
    rendering.ctx.fillRect(0, 0, rendering.canvas.clientWidth, rendering.canvas.clientHeight);
    rendering.ctx.globalAlpha = originalAlpha;

    colorFade.increment();

    // Draw circles for spell
    rendering.ctx.beginPath();
    rendering.ctx.lineWidth = 30;
    rendering.ctx.strokeStyle = "orange";
    if (positions.length > 0) {
        rendering.ctx.moveTo(positions[0].x, positions[0].y);
        for (const pos of positions) {
            rendering.ctx.lineTo(pos.x, pos.y);
        }
    }
    rendering.ctx.stroke();
    
    if (successfulSpellLetters.length > 0) {
        document.getElementById("spell-display").innerHTML = `Spell: "${successfulSpellLetters.join("")}"`;
    }

    if (!casting) {
        colorFade.reset();
        reverseColorFade.reset();
        window.requestAnimationFrame(gameLoop);
    }
    else {
        window.requestAnimationFrame(castingLoop);
    }
}

// Main game loop. Only exits from it to switch to a secondary rendering loop.
function gameLoop() {
    brona.movementLoopStep(1);
    renderLoopStep();

    const originalAlpha = rendering.ctx.globalAlpha;
    rendering.ctx.globalAlpha = reverseColorFade.value;
    rendering.ctx.fillRect(0, 0, rendering.canvas.clientWidth, rendering.canvas.clientHeight);
    rendering.ctx.globalAlpha = originalAlpha;

    reverseColorFade.increment();

    if (successfulSpellLetters.length > 0) {
        document.getElementById("spell-display").innerHTML = `Spell: "${successfulSpellLetters.join()}"`;
    }

    if (casting) {
        castingLoop();
        successfulSpellLetters = [];
    }
    else {
        // Loop forever
        window.requestAnimationFrame(gameLoop);
    }
}
gameLoop();
