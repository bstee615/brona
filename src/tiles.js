import Object from "./object";
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

function loadSprite(row, col) {
    if (tileSprites[row][col].loaded) {
        return;
    }

    const tilewidth = 32;

    tileSprites[row][col] = new Sprite("forest_tiles.png", 
    col * tilewidth, row * tilewidth,
    tilewidth, tilewidth,
        );
}

export function loadTile(tilerow, tilecol, name = "Unnamed", x = 0, y = 0, w = 1, h = 1) {
    loadSprite(tilerow, tilecol);

    const tile = new TileObject(x, y, w, h, 
        tilerow,
        tilecol,
        name);

    tiles.push(tile);

    return tile;
}

export let colliders = [];

export function loadObject(tilerow, tilecol, name = "Unnamed", x = 0, y = 0, w = 1, h = 1, collider=false) {
    const tile = loadTile(tilerow, tilecol, name, x, y, w, h);

    if (collider) {
        colliders.push(tile);
    }
}

class TileObject extends Object {
    constructor(x, y, w, h, tilerow, tilecol, name) {
        super(x, y, w, h);

        this.tilerow = tilerow;
        this.tilecol = tilecol;

        this.name = name;
    }

    sprite() {
        loadSprite(this.tilerow, this.tilecol);
        return tileSprites[this.tilerow][this.tilecol];
    }
}

// export function drawSprite(ctx, tile) {
//     tile.getSprite().draw(ctx, gameToPx(tile.x), gameToPx(tile.y), gameToPx(tile.w), gameToPx(tile.h));
// }
