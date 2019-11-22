import * as rendering from "./rendering";
import * as control from "./control";
import * as brona from "./brona";
import {spellLetters, casting, positions} from "./spells";

import {Tilemap} from "./tiles";
import Sprite from "./sprite";

let forestTiles = new Tilemap("forest_tiles.png", 12, 16, 32);

forestTiles.loadTile(0, 13, "Mushroom");
forestTiles.loadTile(0, 13, "Mushroom", 0, 1);
forestTiles.loadTile(6, 0, "Pine_1", 2, 4);
forestTiles.loadTile(7, 0, "Pine_2", 2, 5);
forestTiles.loadTile(6, 1, "Pine_3", 3, 4);
forestTiles.loadTile(7, 1, "Pine_4", 3, 5);

forestTiles.loadObject(0, 6, "Pit_1_1", 5, 5, 1, 1, true);
forestTiles.loadObject(0, 7, "Pit_2_1", 6, 5, 1, 1, true);
forestTiles.loadObject(0, 8, "Pit_3_1", 7, 5, 1, 1, true);
forestTiles.loadObject(1, 6, "Pit_1_2", 5, 6, 1, 1, true);
forestTiles.loadObject(1, 7, "Pit_2_2", 6, 6, 1, 1, true);
forestTiles.loadObject(1, 8, "Pit_3_2", 7, 6, 1, 1, true);
forestTiles.loadObject(2, 6, "Pit_1_3", 5, 7, 1, 1, true);
forestTiles.loadObject(2, 7, "Pit_2_3", 6, 7, 1, 1, true);
forestTiles.loadObject(2, 8, "Pit_3_3", 7, 7, 1, 1, true);

const bg = new Sprite("forest.png");

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
let timeFade = new Fade(0.05, 1, -0.1, 0.9);
reverseColorFade.value = 0;

function renderLoopStep() {
    // Clear canvas
    rendering.ctx.clearRect(0, 0, rendering.canvas.clientWidth, rendering.canvas.clientHeight);
    
    // Draw background image
    bg.draw(rendering.ctx, 0, 0, rendering.canvas.clientWidth, rendering.canvas.clientHeight);

    // Draw loaded tiles
    for (const tile of forestTiles.tiles) {
        tile.draw(rendering.ctx);
    }

    // Draw Brona
    brona.obj.draw(rendering.ctx);
}

// Movement handlers
rendering.canvas.addEventListener("mousedown", function(ev) {
    if (ev.button == 0) {
        brona.target(control.mousePosition.x, control.mousePosition.y);
    }
});
rendering.canvas.addEventListener("mousemove", function() {
    if (control.mousedown) {
        brona.target(control.mousePosition.x, control.mousePosition.y);
    }
});

// Main game loop. Only exits from it to switch to a secondary rendering loop.
function gameLoop() {
    brona.movementLoopStep(1);
    renderLoopStep();

    if (spellLetters.length > 0) {
        document.getElementById("spell-display").innerHTML = `Spell: "${spellLetters.join()}"`;
    }
    else {
        document.getElementById("spell-display").innerHTML = "No spell";
    }

    if (casting) {
        spellLetters.splice(0, spellLetters.length);

        // Increment time scale fade
        timeFade.increment();
        
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
    }
    else {
        // Apply reverse fade
        const originalAlpha = rendering.ctx.globalAlpha;
        rendering.ctx.globalAlpha = reverseColorFade.value;
        rendering.ctx.fillRect(0, 0, rendering.canvas.clientWidth, rendering.canvas.clientHeight);
        rendering.ctx.globalAlpha = originalAlpha;
    
        reverseColorFade.increment();

        colorFade.reset();
        reverseColorFade.reset();

        // Loop forever
        window.requestAnimationFrame(gameLoop);
    }
}
gameLoop();
