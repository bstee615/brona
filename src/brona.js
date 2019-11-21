import {gameToPx} from "./rendering";
import Sprite from "./sprite";

export const obj = {
    x: 3,
    y: 4,
    w: 1,
    h: 1,
    sprite: new Sprite("brona.png", "Brona"),
    draw: function(ctx) {
        this.sprite.draw(ctx, gameToPx(this.x), gameToPx(this.y), gameToPx(this.w), gameToPx(this.h))
    }
}

import * as rendering from "./rendering";

let targetPosition = {
    x: null,
    y: null
};

// Update stuff
rendering.canvas.addEventListener("click", function(ev) {
    targetPosition = {
        x: rendering.pxToGame(ev.offsetX) - obj.w/2,
        y: rendering.pxToGame(ev.offsetY) - obj.h/2
    };
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
            targetPosition.x = null;
            targetPosition.y = null;
        }
    
        obj.x += netDelta.x;
        obj.y += netDelta.y;
    }
}
