export class Fader {
    private range: any;
    private inc: number;
    private currentValue: number;
    private accelFactor: number;
    private doneFading: boolean;
    get value() {
        return this.currentValue;
    }
    set value(input) {
        this.currentValue = input;
    }
    get done() {
        return this.doneFading;
    }
    constructor(min, max, inc, accelFactor = 1) {
        this.range = {
            min,
            max
        };
        this.inc = inc;
        this.accelFactor = accelFactor;
        this.reset();
    }
    increment() {
        if (this.doneFading) {
            return;
        }
        this.currentValue += this.inc;
        this.inc = this.inc * this.accelFactor;
        if (this.inc > 0) {
            if (this.currentValue >= this.range.max) {
                this.currentValue = this.range.max;
                this.doneFading = true;
            }
        }
        else {
            if (this.currentValue <= this.range.min) {
                this.currentValue = this.range.min;
                this.doneFading = true;
            }
        }
    }
    reset() {
        if (this.inc > 0) {
            this.currentValue = this.range.min;
        }
        else {
            this.currentValue = this.range.max;
        }
        this.doneFading = false;
    }
}
;
