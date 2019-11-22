import Sprite, {SpriteObject} from "./sprite";
import * as control from "./control";
import {canvas, pxToGame} from "./rendering";
import {correctCollisions} from "./colliders";
import { Vector } from "./Vector";

export const obj = new SpriteObject(3, 4, 1, 1, new Sprite("brona.png", "Brona"));
const speed = 0.3;

export let targetPosition = {
    x: null,
    y: null
};

function target(x: number, y: number) {
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
    const magnitude = Math.sqrt(delta.x*delta.x + delta.y*delta.y);
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

export function movementLoopStep() {
    const inputDelta = getInputDelta();
    let movementDelta = getMovementDelta(inputDelta);

    if (Math.sqrt(inputDelta.x*inputDelta.x + inputDelta.y*inputDelta.y) <= speed) {
        // Within small distance of target -
        // correct to exact and reset targetPosition.
        movementDelta = inputDelta;
        cancelTargetPosition();
    }
    
    const postCollisionDelta = getCollisionDelta(movementDelta);

    obj.x += postCollisionDelta.x;
    obj.y += postCollisionDelta.y;

    getCollisionDelta(inputDelta);
}
