import { SpriteObject } from "./sprite";
import { Vector } from "./Vector";

export let colliders = [];

export function registerCollider(coll: any) {
    colliders.push(coll);
}

export function correctCollisions(pos: SpriteObject, delta: Vector) {
    const bleft = pos.x + delta.x;
    const bright = pos.x + pos.w + delta.x;
    const btop = pos.y + delta.y;
    const bbot = pos.y + pos.h + delta.y;

    for (const c of colliders) {
        const cleft = c.x;
        const cright = c.x + c.w;
        const ctop = c.y;
        const cbot = c.y + c.h;

        // Check collision
        if (bleft > cright || bright < cleft ||
            btop > cbot || bbot < ctop) {
                continue;
        }

        // There is some collision
        const bcenter = {
            x: (bleft + bright / 2),
            y: (bbot + btop / 2)
        };
        const ccenter = {
            x: (cleft + cright / 2),
            y: (cbot + ctop / 2)
        };

        const direction = {
            x: (bcenter.x - ccenter.x) / Math.abs(bcenter.x - ccenter.x),
            y: (bcenter.y - ccenter.y) / Math.abs(bcenter.y - ccenter.y)
        };

        if (direction.x > 0) {
            if (direction.y > 0) {
                if (Math.abs(bleft - cright) < Math.abs(btop - cbot)) {
                    delta.x = cright + 0.001 - pos.x;
                }
                else {
                    delta.y = cbot + 0.001 - pos.y;
                }
            }
            else {
                if (Math.abs(bleft - cright) < Math.abs(bbot - ctop)) {
                    delta.x = cright + 0.001 - pos.x;
                }
                else {
                    delta.y = ctop - 0.001 - (pos.y + pos.h);
                }
            }
        }
        else {
            if (direction.y > 0) {
                if (Math.abs(bright - cleft) < Math.abs(btop - cbot)) {
                    delta.x = cleft - 0.001 - (pos.x + pos.w);
                }
                else {
                    delta.y = cbot + 0.001 - pos.y;
                }
            }
            else {
                if (Math.abs(bright - cleft) < Math.abs(bbot - ctop)) {
                    delta.x = cleft - 0.001 - (pos.x + pos.w);
                }
                else {
                    delta.y = ctop - 0.001 - (pos.y + pos.h);
                }
            }
        }
    }

    return delta;
}