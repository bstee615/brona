import { rightMousedown } from "./control";
import { canvas } from "./rendering";
import { SpellState } from "./SpellState";
import { Vector } from "./Vector";

export const spellState = new SpellState();

canvas.addEventListener(
    "contextmenu",
    function(ev) {
        ev.preventDefault();
        return false;
    },
    false
);

canvas.addEventListener("mousedown", function(ev) {
    if (ev.button == 2) {
        spellState.startSpell();
        spellState.resetSpellPoints();
    }
});

canvas.addEventListener("mousemove", function(ev) {
    if (spellState.isCasting && rightMousedown) {
        spellState.addSpellPoint(new Vector(ev.offsetX, ev.offsetY));
    }
});

canvas.addEventListener("mouseup", function(ev) {
    if (ev.button == 2) {
        if (spellState.isCasting) {
            spellState.saveSpell();
            spellState.startSpellExpiry();
        }
    }
});
