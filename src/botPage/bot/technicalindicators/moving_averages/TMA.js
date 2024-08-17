import { WMA } from './WMA';
import { SWMA } from './SWMA';

export class TMA {
    constructor(input) {
        const { period } = input;
        const priceArray = input.values;
        this.result = [];
        const wma$$ = new WMA({
            period,
            values: [],
        });
        const genFn = function*() {
            let tick = yield;
            let wma;
            while (true) {
                wma = wma$$.nextValue(tick);
                if (wma !== undefined) {
                    tick = yield wma;
                }
            }
        };
        this.generator = genFn();
        this.generator.next();
        priceArray.forEach(tick => {
            const result = this.generator.next(tick);
            if (result.value !== undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price).value;
        if (result !== undefined) {
            return result;
        }
        return undefined;
    }

    static calculate = input => {
        const { result } = new TMA(input);
        if (input.reversedInput) {
            result.reverse();
        }
        const obj = {
            values: result,
        };
        const final = new SWMA(obj).result;
        return final;
    };
}

export function tma(input) {
    const { result } = new TMA(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/moving_averages/TMA.js
