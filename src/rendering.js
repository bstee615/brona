export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const tilesize = canvas.width / 24;

export function pxToGame(px) {
    return px / tilesize;
}
export function gameToPx(px) {
    return px * tilesize;
}

export function drawBg(bgSprite) {
    bgSprite.draw(ctx);
}
