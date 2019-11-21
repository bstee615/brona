import {gameToPx} from "./rendering";

export default class Object {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.draw = this.draw.bind(this);
    }

    draw(ctx) {
        this.sprite().draw(ctx, gameToPx(this.x), gameToPx(this.y), gameToPx(this.w), gameToPx(this.h))
    }

    sprite() {
        throw new Error("sprite() not implemented");
    }
}
