import { Indicator, IndicatorInput } from '../indicator/indicator';
/**
 * Created by AAravindan on 5/17/16.
 */
('use strict');
export class OBVInput extends IndicatorInput {}
export class OBV extends Indicator {
    constructor(input) {
        super(input);
        const closes = input.close;
        const volumes = input.volume;
        this.result = [];
        this.generator = (function*() {
            let result = 0;
            let tick;
            let lastClose;
            tick = yield;
            if (tick.close && typeof tick.close === 'number') {
                lastClose = tick.close;
                tick = yield;
            }
            while (true) {
                if (lastClose < tick.close) {
                    result += tick.volume;
                } else if (tick.close < lastClose) {
                    result -= tick.volume;
                }
                lastClose = tick.close;
                tick = yield result;
            }
        })();
        this.generator.next();
        closes.forEach((close, index) => {
            const tickInput = {
                close : closes[index],
                volume: volumes[index],
            };
            const result = this.generator.next(tickInput);
            if (result.value != undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        return this.generator.next(price).value;
    }
}
OBV.calculate = obv;
export function obv(input) {
    Indicator.reverseInputs(input);
    const result = new OBV(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/volume/OBV.js
