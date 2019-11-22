import Sprite from "./sprite";

export const canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const tilesize = canvas.width / 24;

export function pxToGame(px: number) {
    return px / tilesize;
}
export function gameToPx(px: number) {
    return px * tilesize;
}
