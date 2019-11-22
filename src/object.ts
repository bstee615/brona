import { gameToPx } from "./rendering";
import Sprite from "./sprite";

export default class GameObject {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.draw = this.draw.bind(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.sprite().draw(
            ctx,
            gameToPx(this.x),
            gameToPx(this.y),
            gameToPx(this.w),
            gameToPx(this.h)
        );
    }

    sprite(): Sprite {
        throw new Error("sprite() not implemented");
    }
}
