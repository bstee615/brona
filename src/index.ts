import * as brona from "./brona";
import { Fader } from "./Fader";
import { canvas, ctx } from "./rendering";
import { spellState } from "./spells";
import Sprite from "./sprite";
import { Tilemap } from "./tiles";


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

let fadeDown = new Fader(0.2, 0.6, 0.01);
let fadeUp = new Fader(0, 0.6, -0.01);
let timeScale = new Fader(0.05, 1, -0.1, 0.9);
fadeUp.value = 0;

function renderObjects() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Draw background image
    bg.draw(ctx, 0, 0, canvas.clientWidth, canvas.clientHeight);

    // Draw loaded tiles
    for (const tile of forestTiles.tiles) {
        tile.draw(ctx);
    }

    // Draw Brona
    brona.obj.draw(ctx);
}

function displaySpellInfo() {
    document.getElementById("spell-display").innerHTML = spellState.toString();
}

function doFadeUp() {
    const originalAlpha = ctx.globalAlpha;
    ctx.globalAlpha = fadeUp.value;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.globalAlpha = originalAlpha;

    fadeUp.increment();
}

function doFadeDown() {
    const originalAlpha = ctx.globalAlpha;
    ctx.globalAlpha = fadeDown.value;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.globalAlpha = originalAlpha;

    fadeDown.increment();
}

// Main game loop. Only exits from it to switch to a secondary rendering loop.
function mainLoop() {
    brona.moveBrona(timeScale.value);
    renderObjects();

    displaySpellInfo();

    if (spellState.isCasting) {
        doFadeDown();
        fadeUp.reset();

        timeScale.increment();

        spellState.drawSpell();
    } else {
        doFadeUp();
        fadeDown.reset();
        timeScale.reset();
    }

    window.requestAnimationFrame(mainLoop);
}
mainLoop();
