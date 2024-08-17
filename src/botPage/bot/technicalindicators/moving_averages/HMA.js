// import { Indicator } from '../indicator/indicator';
import { WMA } from './WMA';
// const h =  ta.wma(2*ta.wma(src, length/2)-ta.wma(src, length), math.floor(math.sqrt(length)))
export class HMA {
    constructor(input) {
        const { period } = input;
        const priceArray = input.values;
        this.result = [];
        const wma$$1 = new WMA({
            period,
            values: [],
        });
        const wma$$2 = new WMA({
            period: Math.round(period / 2),
            values: [],
        });
        const genFn = function*() {
            let tick = yield;
            let result;
            let wma1;
            let wma2;
            while (true) {
                wma1 = wma$$1.nextValue(tick);
                wma2 = wma$$2.nextValue(tick);
                if (wma1 !== undefined && wma2 !== undefined) {
                    result = 2 * wma2 - wma1;
                    tick = yield result;
                }
            }
        };
        this.generator = genFn();
        this.generator.next();
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
        const { result } = new HMA(input);
        if (input.reversedInput) {
            result.reverse();
        }
        const obj = {
            values: result,
            period: Math.round(Math.sqrt(input.period)),
        };
        const final = new WMA(obj).result;
        return final;
    };
}

export function hma(input) {
    const { result } = new HMA(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/moving_averages/HMA.js
