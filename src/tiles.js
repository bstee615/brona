import { gameToPx } from "./rendering";
import Sprite from "./sprite";

// Tile stuff

// 12x16 tiles in forest_tiles.png
let tileSprites = [];
for (let row = 0; row < 12; row ++) {
    tileSprites.push([]);
    for (let col = 0; col < 16; col ++) {
        tileSprites[row].push(new Sprite());
    }
}

// Holds instances of the tiles
export let tiles = [];

function loadTile(row, col, name) {
    if (tileSprites[row][col].loaded) {
        return;
    }

    const tilewidth = 32;

    tileSprites[row][col] = new Sprite("forest_tiles.png", name, 
    col * tilewidth, row * tilewidth,
    tilewidth, tilewidth,
        );
}

export function loadSprite(tilerow, tilecol, name = "Unnamed", x = 0, y = 0, w = 1, h = 1) {
    loadTile(tilerow, tilecol, name);

    tiles.push({
        tilerow,
        tilecol,
        name,
        x,
        y,
        w,
        h,
        getSprite: function() {
            return tileSprites[this.tilerow][this.tilecol];
        }
    });
}

// export function drawSprite(ctx, tile) {
//     tile.getSprite().draw(ctx, gameToPx(tile.x), gameToPx(tile.y), gameToPx(tile.w), gameToPx(tile.h));
// }
