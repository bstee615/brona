import { registerCollider } from "./colliders";
import Sprite from "./Sprite";
import { TileObject } from "./TileObject";
export class Tilemap {
    filepath: string;
    // Holds instances of the tiles
    tiles: Array<TileObject>;
    // 12x16 tiles in forest_tiles.png
    tileSprites: Array<Array<Sprite>>;
    nrows: number;
    ncols: number;
    tilewidth: number;
    constructor(filepath: string, nrows: number, ncols: number, tilewidth: number) {
        this.filepath = filepath;
        this.tileSprites = [];
        for (let row = 0; row < nrows; row++) {
            this.tileSprites.push([]);
            for (let col = 0; col < ncols; col++) {
                this.tileSprites[row].push(new Sprite());
            }
        }
        this.tiles = [];
        this.tilewidth = tilewidth;
        this.nrows = nrows;
        this.ncols = ncols;
    }
    loadSprite(row: number, col: number): Sprite {
        if (this.tileSprites[row][col].loaded) {
            return this.tileSprites[row][col];
        }
        return new Sprite(this.filepath, col * this.tilewidth, row * this.tilewidth, this.tilewidth, this.tilewidth);
    }
    loadTile(tilerow: number, tilecol: number, name = "Unnamed", x = 0, y = 0, w = 1, h = 1): TileObject {
        this.tileSprites[tilerow][tilecol] = this.loadSprite(tilerow, tilecol);
        const tile = new TileObject(this, x, y, w, h, tilerow, tilecol, name);
        this.tiles.push(tile);
        return tile;
    }
    loadObject(tilerow: number, tilecol: number, name = "Unnamed", x = 0, y = 0, w = 1, h = 1, collider = false) {
        const tile = this.loadTile(tilerow, tilecol, name, x, y, w, h);
        if (collider) {
            registerCollider(tile);
        }
    }
}
