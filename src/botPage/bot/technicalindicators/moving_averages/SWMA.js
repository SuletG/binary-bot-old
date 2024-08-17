import { LinkedList } from '../Utils/LinkedList';
// x[3] * 1 / 6 + x[2] * 2 / 6 + x[1] * 2 / 6 + x[0] * 1 / 6
export class SWMA {
    constructor(input) {
        const priceArray = input.values;
        this.result = [];
        const genFn = function*() {
            const data = new LinkedList();
            while (true) {
                if (data.length < 4) {
                    data.push(yield);
                } else {
                    data.resetCursor();
                    const data3 = data.next();
                    const data2 = data.next();
                    const data1 = data.next();
                    const data0 = data.next();
                    const result = (data3 * 1) / 6 + (data2 * 2) / 6 + (data1 * 2) / 6 + (data0 * 1) / 6;
                    const next = yield result;
                    data.shift();
                    data.unshift(next);
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
        const { result } = new SWMA(input);
        if (input.reversedInput) {
            result.reverse();
        }
        return result;
    };
}

export function swma(input) {
    const { result } = new SWMA(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/moving_averages/SWMA.js
