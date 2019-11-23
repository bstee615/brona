import { correctCollisions } from "./colliders";
import * as control from "./control";
import { canvas, pxToGame } from "./rendering";
import Sprite from "./Sprite";
import { SpriteObject } from "./SpriteObject";
import { Vector } from "./Vector";

// Movement handlers
canvas.addEventListener("mousedown", function(ev) {
    if (ev.button == 0) {
        target(control.mousePosition.x, control.mousePosition.y);
    }
});
canvas.addEventListener("mousemove", function() {
    if (control.mousedown) {
        target(control.mousePosition.x, control.mousePosition.y);
    }
});

export const obj = new SpriteObject(
    3,
    4,
    1,
    1,
    new Sprite("brona.png", "Brona")
);
const speed = 0.3;

let targetPosition = {
    x: null,
    y: null
};

export function target(x: number, y: number) {
    targetPosition = {
        x: pxToGame(x) - obj.w / 2,
        y: pxToGame(y) - obj.h / 2
    };
}

export function cancelTargetPosition() {
    targetPosition.x = null;
    targetPosition.y = null;
}

function getCollisionDelta(delta: Vector): Vector {
    let collDelta = correctCollisions(obj, delta);

    if (collDelta.x || collDelta.y) {
        delta = collDelta;
    }

    return delta;
}

function getInputDelta(): Vector {
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
    return delta;
}

function getMovementDelta(delta: Vector): Vector {
    const magnitude = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    if (magnitude > 0) {
        const unitDelta = {
            x: delta.x / magnitude,
            y: delta.y / magnitude
        };

        return {
            x: unitDelta.x * speed,
            y: unitDelta.y * speed
        };
    }
}

export function moveBrona(timeScale) {
    const inputDelta = getInputDelta();
    let movementDelta = getMovementDelta(inputDelta);

    if (
        Math.sqrt(inputDelta.x * inputDelta.x + inputDelta.y * inputDelta.y) <=
        speed
    ) {
        // Within small distance of target -
        // correct to exact and reset targetPosition.
        movementDelta = inputDelta;
        cancelTargetPosition();
    }

    const postCollisionDelta = getCollisionDelta(movementDelta);

    const timeScaledDelta = {
        x: postCollisionDelta.x * timeScale,
        y: postCollisionDelta.y * timeScale
    };

    obj.x += timeScaledDelta.x;
    obj.y += timeScaledDelta.y;

    getCollisionDelta(inputDelta);
}
