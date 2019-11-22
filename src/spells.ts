import { canvas } from "./rendering";
import { rightMousedown } from "./control";

export let casting = false;

export let positions = [];

import Tesseract from 'tesseract.js';

export let spellLetters = [];

function saveSpell() {
    let memoryCanvas = document.createElement("canvas");
    memoryCanvas.width = canvas.width;
    memoryCanvas.height = canvas.height;

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
        spellLetters.push(result.text);
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
