function imagePath(filepath) {
    return `images/${filepath}`;
}

export default class Sprite {

    constructor(filepath, name = "unnnamed", srcX = null, srcY = null, srcW = null, srcH = null) {
        this.loaded = false;
        
        if (filepath) {
            this.img = new Image();
            this.img.src = imagePath(filepath);
            this.img.onload = function() {
                this.loaded = true;
            };
        }
        
        this.name = name;

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