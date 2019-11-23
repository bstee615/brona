import Sprite from "./Sprite";

export const canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const tilesize = canvas.width / 24;

export function pxToGame(px: number) {
    return px / tilesize;
}
export function gameToPx(px: number) {
    return px * tilesize;
}

const bg = new Sprite("forest.png");

export function renderObjects(objectsToDraw) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Draw background image
    bg.draw(ctx, 0, 0, canvas.clientWidth, canvas.clientHeight);

    // Draw loaded tiles
    for (const obj of objectsToDraw) {
        obj.draw(ctx);
    }
}
