import Tesseract from "tesseract.js";
import { canvas, ctx } from "./rendering";
import { Vector } from "./Vector";
export class SpellState {
    private casting: boolean;
    private spellPoints: Array<Vector>;
    private spellLetters: Array<string>;
    private castingTimeout: NodeJS.Timeout;
    private spellCooking: boolean;

    constructor() {
        this.casting = false;
        this.spellPoints = [];
        this.spellLetters = [];
        this.castingTimeout = null;
        this.spellCooking = false;
    }

    get isCasting() {
        return this.casting;
    }

    public toString(): string {
        if (this.spellLetters.length > 0) {
            return this.spellLetters.join("");
        } else if (this.spellCooking) {
            return "Spell cooking...";
        } else {
            return "No spell";
        }
    }

    resetSpellPoints() {
        this.spellPoints = [];
    }

    addSpellPoint(pxPos: Vector) {
        this.spellPoints.push({ x: pxPos.x, y: pxPos.y });
    }

    startSpell() {
        this.casting = true;
        if (this.castingTimeout) {
            clearTimeout(this.castingTimeout);
        }
        this.castingTimeout = null;
    }
    startSpellExpiry() {
        let self = this;
        this.castingTimeout = setTimeout(function() {
            self.casting = false;
        }, 1000);
    }

    drawSpell() {
        ctx.beginPath();
        ctx.lineWidth = 30;
        ctx.strokeStyle = "orange";
        if (this.spellPoints.length > 0) {
            ctx.moveTo(this.spellPoints[0].x, this.spellPoints[0].y);
            for (const pos of this.spellPoints) {
                ctx.lineTo(pos.x, pos.y);
            }
        }
        ctx.stroke();
    }

    saveSpell() {
        let memoryCanvas = document.createElement("canvas");
        memoryCanvas.width = canvas.width;
        memoryCanvas.height = canvas.height;
        let memoryCtx = memoryCanvas.getContext("2d");
        memoryCtx.strokeStyle = "white";
        memoryCtx.fillStyle = "white";
        memoryCtx.fillRect(0, 0, memoryCanvas.width, memoryCanvas.height);
        memoryCtx.beginPath();
        memoryCtx.lineWidth = 30;
        memoryCtx.strokeStyle = "orange";
        if (this.spellPoints.length > 0) {
            memoryCtx.moveTo(this.spellPoints[0].x, this.spellPoints[0].y);
            for (const pos of this.spellPoints) {
                memoryCtx.lineTo(pos.x, pos.y);
            }
        }
        memoryCtx.stroke();
        document.getElementById("spell-display").innerHTML = "Thinking...";

        this.spellCooking = true;
        Tesseract.recognize(memoryCanvas).then(result => {
            this.spellLetters.push(result.text);
            this.spellCooking = false;
        });

        this.resetSpellPoints();
    }
}
