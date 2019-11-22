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
    let newDelta = {
        x: 0,
        y: 0
    };

    const bleft = obj.x + delta.x;
    const bright = obj.x + obj.w + delta.x;
    const btop = obj.y + delta.y;
    const bbot = obj.y + obj.h + delta.y;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "purple";

    ctx.beginPath();
    ctx.lineTo(gameToPx(obj.x), gameToPx(obj.y));
    ctx.lineTo(gameToPx(bleft), gameToPx(btop));
    ctx.stroke();
    
    ctx.beginPath();
    ctx.lineTo(gameToPx(obj.x + obj.w), gameToPx(obj.y));
    ctx.lineTo(gameToPx(bright), gameToPx(btop));
    ctx.stroke();
    
    ctx.beginPath();
    ctx.lineTo(gameToPx(obj.x + obj.w), gameToPx(obj.y + obj.h));
    ctx.lineTo(gameToPx(bright), gameToPx(bbot));
    ctx.stroke();
    
    ctx.beginPath();
    ctx.lineTo(gameToPx(obj.x), gameToPx(obj.y + obj.h));
    ctx.lineTo(gameToPx(bleft), gameToPx(bbot));
    ctx.stroke();

    for (const c of colliders) {
        const cleft = c.x;
        const cright = c.x + c.w;
        const ctop = c.y;
        const cbot = c.y + c.h;

        // check colinear vertically
        if ((bleft > cleft && bleft < cright ||
                bright > cleft && bright < cright) &&
            (btop > ctop && btop < cbot ||
                bbot > ctop && bbot < cbot)) {

            // Collides somewhere

            // Assume bottom right
            if (Math.abs(cright - bleft) < Math.abs(cbot - btop)) {
                // correct to the right
                newDelta.x = cright - obj.x;
            }
            else {
                // correct to the bottom
                newDelta.y = cbot - obj.y;
            }
        }
    }

    return newDelta;
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

        let newDelta = correctCollisions(netDelta);

        if (newDelta.x) {
            netDelta.x = newDelta.x;
        }
        if (newDelta.y) {
            netDelta.y = newDelta.y;
        }

        ctx.beginPath();
        ctx.rect(gameToPx(obj.x), gameToPx(obj.y), gameToPx(obj.w), gameToPx(obj.h));
        ctx.lineWidth = 3;
        ctx.strokeStyle = "orange";
        ctx.stroke();

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
