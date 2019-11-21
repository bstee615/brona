import * as rendering from "./rendering";

import * as brona from "./brona";

import * as tiles from "./tiles";
import Sprite from "./sprite";

tiles.loadTile(0, 13, "Mushroom");
tiles.loadTile(0, 13, "Mushroom", 0, 1);
tiles.loadTile(6, 0, "Pine_1", 2, 4);
tiles.loadTile(7, 0, "Pine_2", 2, 5);
tiles.loadTile(6, 1, "Pine_3", 3, 4);
tiles.loadTile(7, 1, "Pine_4", 3, 5);

const bg = new Sprite("forest.png");

function renderLoopStep() {
    // Draw background image
    bg.draw(rendering.ctx, 0, 0, rendering.canvas.width, rendering.canvas.height);

    // Draw loaded tiles
    for (const tile of tiles.tiles) {
        tile.draw(rendering.ctx);
    }

    // Draw Brona
    brona.obj.draw(rendering.ctx);
}

function gameLoop() {
    brona.movementLoopStep();
    renderLoopStep();

    // Loop forever
    window.requestAnimationFrame(gameLoop);
}
gameLoop();