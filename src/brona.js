import Sprite, {SpriteObject} from "./sprite";
import * as control from "./control";
import {canvas, pxToGame} from "./rendering";

export const obj = new SpriteObject(3, 4, 1, 1, new Sprite("brona.png", "Brona"));

export let targetPosition = {
    x: null,
    y: null
};

function target(x, y) {
    targetPosition = {
        x: pxToGame(x) - obj.w/2,
        y: pxToGame(y) - obj.h/2
    };
}

export function cancelTargetPosition() {
    targetPosition.x = null;
    targetPosition.y = null;
}

canvas.addEventListener("mousedown", function() {
    target(control.mousePosition.x, control.mousePosition.y);
});

canvas.addEventListener("mousemove", function() {
    if (control.mousedown) {
        target(control.mousePosition.x, control.mousePosition.y);
    }
});

export function movementLoopStep() {
    const speed = 1;
    const delta = {
        x: 0,
        y: 0
    };
    if (targetPosition.x != null) {
        delta.x = targetPosition.x - obj.x;
    }
    if (targetPosition.y != null) {
        delta.y = targetPosition.y - obj.y;
    }

    const magnitude = Math.sqrt(delta.x*delta.x + delta.y*delta.y);
    if (magnitude > 0) {
        const deltaUnit = {
            x: delta.x / magnitude,
            y: delta.y / magnitude
        };
        let netDelta = {
            x: deltaUnit.x * speed,
            y: deltaUnit.y * speed
        };

        if (Math.sqrt(delta.x*delta.x + delta.y*delta.y) <= speed) {
            // Within small distance of target -
            // correct to exact and reset targetPosition.
            netDelta = delta;
            cancelTargetPosition();
        }
    
        obj.x += netDelta.x;
        obj.y += netDelta.y;
    }
}
