function imagePath(filepath) {
    return `images/${filepath}`;
}

export default class Sprite {

    constructor(filepath, srcX = null, srcY = null, srcW = null, srcH = null) {
        this.loaded = false;
        
        if (filepath) {
            this.img = new Image();
            this.img.src = imagePath(filepath);
            let self = this;
            this.img.onload = function() {
                self.loaded = true;
            };
        }

        this.srcX = srcX;
        this.srcY = srcY;
        this.srcW = srcW;
        this.srcH = srcH;
        
        this.draw = this.draw.bind(this);
    }

    draw(ctx, x, y, w, h) {
        // console.log(this.name, x, y, w, h);
        if (this.srcX != null && this.srcY != null && this.srcW != null && this.srcH != null) {
            ctx.drawImage(this.img, this.srcX, this.srcY, this.srcW, this.srcH, x, y, w, h);
        }
        else {
            ctx.drawImage(this.img, x, y, w, h);
        }
    }
}

import Object from "./object";

export class SpriteObject extends Object {
    constructor(x, y, w, h, sprite) {
        super(x, y, w, h);

        this.img = sprite;
    }

    sprite() {
        return this.img;
    }
}
