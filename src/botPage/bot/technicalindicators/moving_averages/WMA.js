
import { Indicator } from '../indicator/indicator';
import { LinkedList } from '../Utils/LinkedList';

export class WMA extends Indicator {
    constructor(input) {
        super(input);
        const period = input.period;
        const priceArray = input.values;
        this.result = [];
        this.generator = (function*() {
            const data = new LinkedList();
            const denominator = (period * (period + 1)) / 2;
            while (true) {
                if (data.length < period) {
                    data.push(yield);
                } else {
                    data.resetCursor();
                    let result = 0;
                    for (let i = 1; i <= period; i++) {
                        result += (data.next() * i) / denominator;
                    }
                    const next = yield result;
                    data.shift();
                    data.push(next);
                }
            }
        })();
        this.generator.next();
        priceArray.forEach((tick, index) => {
            const result = this.generator.next(tick);
            if (result.value != undefined) {
                this.result.push(this.format(result.value));
            }
        });
    }
    // STEP 5. REMOVE GET RESULT FUNCTION
    nextValue(price) {
        const result = this.generator.next(price).value;
        if (result != undefined) return this.format(result);
    }
}
WMA.calculate = wma;
export function wma(input) {
    Indicator.reverseInputs(input);
    const result = new WMA(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/moving_averages/WMA.js
