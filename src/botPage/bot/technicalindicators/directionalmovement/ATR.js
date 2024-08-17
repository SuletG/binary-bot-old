import { Indicator, IndicatorInput } from '../indicator/indicator';
import { WEMA } from '../moving_averages/WEMA';
import { TrueRange } from './TrueRange';

export class ATRInput extends IndicatorInput {}
export class ATR extends Indicator {
    constructor(input) {
        super(input);
        const lows = input.low;
        const highs = input.high;
        const closes = input.close;
        const period = input.period;
        const format = this.format;
        const trueRange = new TrueRange({
            low  : [],
            high : [],
            close: [],
        });
        const wema = new WEMA({
            period,
            values: [],
            format: v => v,
        });
        const genFn = function*() {
            let tick = yield;
            let avgTrueRange;
            let trange;
            while (true) {
                trange = trueRange.nextValue({
                    low  : tick.low,
                    high : tick.high,
                    close: tick.close,
                });
                if (trange === undefined) {
                    avgTrueRange = undefined;
                } else {
                    avgTrueRange = wema.nextValue(trange);
                }
                tick = yield avgTrueRange;
            }
        };
        this.generator = genFn();
        this.generator.next();
        this.result = [];
        lows.forEach((tick, index) => {
            const result = this.generator.next({
                high : highs[index],
                low  : lows[index],
                close: closes[index],
            });
            if (result.value !== undefined) {
                this.result.push(format(result.value));
            }
        });
    }
    nextValue(price) {
        return this.generator.next(price).value;
    }
}
ATR.calculate = atr;
export function atr(input) {
    Indicator.reverseInputs(input);
    const { result } = new ATR(input);
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/directionalmovement/ATR.js
