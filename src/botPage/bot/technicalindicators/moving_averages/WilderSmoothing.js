import { Indicator } from '../indicator/indicator';
import { LinkedList } from '../Utils/LinkedList';
// STEP3. Add class based syntax with export
export class WilderSmoothing extends Indicator {
    constructor(input) {
        super(input);
        this.period = input.period;
        this.price = input.values;
        const genFn = function*(period) {
            const list = new LinkedList();
            let sum = 0;
            let counter = 1;
            let current = yield;
            let result = 0;
            while (true) {
                if (counter < period) {
                    counter++;
                    sum += current;
                    result = undefined;
                } else if (counter == period) {
                    counter++;
                    sum += current;
                    result = sum;
                } else {
                    result = result - result / period + current;
                }
                current = yield result;
            }
        };
        this.generator = genFn(this.period);
        this.generator.next();
        this.result = [];
        this.price.forEach(tick => {
            const result = this.generator.next(tick);
            if (result.value != undefined) {
                this.result.push(this.format(result.value));
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price).value;
        if (result != undefined) return this.format(result);
    }
}
WilderSmoothing.calculate = wildersmoothing;
export function wildersmoothing(input) {
    Indicator.reverseInputs(input);
    const result = new WilderSmoothing(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}
// STEP 6. Run the tests

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/moving_averages/WilderSmoothing.js
