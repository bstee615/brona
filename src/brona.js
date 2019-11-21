import Sprite, {SpriteObject} from "./sprite";
import * as control from "./control";
import {canvas, pxToGame} from "./rendering";
import {colliders} from "./tiles";

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

function correctCollisions(delta) {
    let corrections = null;

    const bleft = obj.x - obj.w/2 + delta.x;
    const bright = obj.x + obj.w/2 + delta.x;
    const btop = obj.y - obj.h/2 + delta.y;
    const bbot = obj.y + obj.h/2 + delta.y;

    for (const c of colliders) {
        const cleft = c.x - c.w/2;
        const cright = c.x + c.w/2;
        const ctop = c.y - c.h/2;
        const cbot = c.y + c.h/2;

        // check colinear vertically
        if (bleft > cleft && bleft < cright ||
            bright > cleft && bright < cright) {
            // check colinear horizontally
            if (btop > ctop && btop < cbot ||
                bbot > ctop && bbot < cbot) {
                    // Collides somewhere
                    corrections = {
                        x: 0,
                        y: 0
                    };

                    // For now, always correct to bottom right
                    if (cright - bleft < bright - cleft) {
                        corrections.x = cright - bleft;
                    }
                    else {
                        corrections.x = cleft - bright;
                    }
                    if (cbot - btop < bbot - ctop) {
                        corrections.y = cbot - btop;
                    }
                    else {
                        corrections.y = ctop - bbot;
                    }
                    
                    if (Math.abs(corrections.x) < Math.abs(corrections.y)) {
                        corrections.x += 0.001 * Math.sign(corrections.x);
                        corrections.y = 0;
                    }
                    else {
                        corrections.x = 0;
                        corrections.y += 0.001 * Math.sign(corrections.y);
                    }

                    cancelTargetPosition();
                }
        }
    }

    return corrections;
}

import {ctx, gameToPx} from "./rendering";

export function movementLoopStep() {
    const speed = 0.3;
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

        let corrections = correctCollisions(netDelta);

        if (corrections) {
            netDelta.x = corrections.x;
            netDelta.y = corrections.y;
        }

        ctx.beginPath();
        ctx.moveTo(gameToPx(obj.x + obj.w/2), gameToPx(obj.y + obj.h/2));
        ctx.lineTo(gameToPx(obj.x + obj.w/2 + netDelta.x), gameToPx(obj.y + obj.h/2 + netDelta.y));
        ctx.lineWidth = 3;
        ctx.strokeStyle = "lime";
        ctx.stroke();
        
        if (targetPosition.x > 0 && targetPosition.y > 0) {
            ctx.beginPath();
            ctx.moveTo(gameToPx(obj.x + obj.w/2), gameToPx(obj.y + obj.h/2));
            ctx.lineTo(gameToPx(targetPosition.x), gameToPx(targetPosition.y));
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.stroke();
        }

        obj.x += netDelta.x;
        obj.y += netDelta.y;
    }
}
