import GameObject from "./GameObject";
import { Tilemap } from "./Tilemap";

// Tile stuff

export class TileObject extends GameObject {
    map: Tilemap;

    tilerow: number;
    tilecol: number;

    name: string;

    constructor(
        map: Tilemap,
        x: number,
        y: number,
        w: number,
        h: number,
        tilerow: number,
        tilecol: number,
        name: string
    ) {
        super(x, y, w, h);

        this.tilerow = tilerow;
        this.tilecol = tilecol;

        this.name = name;

        this.map = map;
    }

    sprite() {
        this.map.loadSprite(this.tilerow, this.tilecol);
        return this.map.tileSprites[this.tilerow][this.tilecol];
    }
}


