import GameObject from "./GameObject";
import Sprite from "./Sprite";

export class SpriteObject extends GameObject {
    spr: Sprite;
    
    constructor(x: number, y: number, w: number, h: number, sprite: Sprite) {
        super(x, y, w, h);
        this.spr = sprite;
    }

    sprite() {
        return this.spr;
    }
}
