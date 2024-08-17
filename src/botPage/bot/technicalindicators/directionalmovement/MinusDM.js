import { Indicator, IndicatorInput } from '../indicator/indicator';
/**
 * Created by AAravindan on 5/8/16.
 */
('use strict');
export class MDMInput extends IndicatorInput {}
export class MDM extends Indicator {
    constructor(input) {
        super(input);
        const lows = input.low;
        const highs = input.high;
        const format = this.format;
        if (lows.length != highs.length) {
            throw 'Inputs(low,high) not of equal size';
        }
        this.result = [];
        this.generator = (function*() {
            let minusDm;
            let current = yield;
            let last;
            while (true) {
                if (last) {
                    const upMove = current.high - last.high;
                    const downMove = last.low - current.low;
                    minusDm = format(downMove > upMove && downMove > 0 ? downMove : 0);
                }
                last = current;
                current = yield minusDm;
            }
        })();
        this.generator.next();
        lows.forEach((tick, index) => {
            const result = this.generator.next({
                high: highs[index],
                low : lows[index],
            });
            if (result.value !== undefined) this.result.push(result.value);
        });
    }
    static calculate(input) {
        Indicator.reverseInputs(input);
        const result = new MDM(input).result;
        if (input.reversedInput) {
            result.reverse();
        }
        Indicator.reverseInputs(input);
        return result;
    }
    nextValue(price) {
        return this.generator.next(price).value;
    }
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/directionalmovement/MinusDM.js
