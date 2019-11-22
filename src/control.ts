import {canvas} from "./rendering";

export let mousedown = false;
export let mousePosition = {
    x: 0,
    y: 0
};

canvas.addEventListener("mousedown", function() {
    mousedown = true;
});

canvas.addEventListener("mouseup", function() {
    mousedown = false;
});

canvas.addEventListener("mousemove", function(ev) {
    mousePosition.x = ev.offsetX;
    mousePosition.y = ev.offsetY;
});
