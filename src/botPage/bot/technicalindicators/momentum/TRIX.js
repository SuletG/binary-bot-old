/**
 * Created by AAravindan on 5/9/16.
 */



import { ROC } from './ROC.js';
import { EMA } from '../moving_averages/EMA.js';
import { Indicator, IndicatorInput } from '../indicator/indicator';

export class TRIXInput extends IndicatorInput {}
export class TRIX extends Indicator {
    constructor(input) {
        super(input);
        const priceArray = input.values;
        const period = input.period;
        const format = this.format;
        const ema = new EMA({
            period,
            values: [],
            format: v => v,
        });
        const emaOfema = new EMA({
            period,
            values: [],
            format: v => v,
        });
        const emaOfemaOfema = new EMA({
            period,
            values: [],
            format: v => v,
        });
        const trixROC = new ROC({
            period: 1,
            values: [],
            format: v => v,
        });
        this.result = [];
        this.generator = (function*() {
            let tick = yield;
            while (true) {
                const initialema = ema.nextValue(tick);
                const smoothedResult = initialema ? emaOfema.nextValue(initialema) : undefined;
                const doubleSmoothedResult = smoothedResult ? emaOfemaOfema.nextValue(smoothedResult) : undefined;
                const result = doubleSmoothedResult ? trixROC.nextValue(doubleSmoothedResult) : undefined;
                tick = yield result ? format(result) : undefined;
            }
        })();
        this.generator.next();
        priceArray.forEach(tick => {
            const result = this.generator.next(tick);
            if (result.value !== undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        const nextResult = this.generator.next(price);
        if (nextResult.value !== undefined) return nextResult.value;
    }
}
TRIX.calculate = trix;
export function trix(input) {
    Indicator.reverseInputs(input);
    const result = new TRIX(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/momentum/TRIX.js
