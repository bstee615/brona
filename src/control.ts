import {canvas} from "./rendering";

export let mousedown = false;
export let rightMousedown = false;
export let mousePosition = {
    x: 0,
    y: 0
};

canvas.addEventListener("mousedown", function(ev) {
    if (ev.button == 0) {
        mousedown = true;
    }
    else if (ev.button == 2) {
        rightMousedown = true;
    }
});

canvas.addEventListener("mouseup", function(ev) {
    if (ev.button == 0) {
        mousedown = false;
    }
    else if (ev.button == 2) {
        rightMousedown = false;
    }
});

canvas.addEventListener("mousemove", function(ev) {
    mousePosition.x = ev.offsetX;
    mousePosition.y = ev.offsetY;
});
