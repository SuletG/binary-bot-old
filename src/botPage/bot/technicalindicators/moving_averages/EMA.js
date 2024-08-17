import { Indicator } from '../indicator/indicator';
import { SMA } from './SMA';

export class EMA extends Indicator {
    constructor(input) {
        super(input);
        const period = input.period;
        const priceArray = input.values;
        const exponent = 2 / (period + 1);
        let sma;
        this.result = [];
        sma = new SMA({
            period,
            values: [],
        });
        const genFn = function*() {
            let tick = yield;
            let prevEma;
            while (true) {
                if (prevEma !== undefined && tick !== undefined) {
                    prevEma = (tick - prevEma) * exponent + prevEma;
                    tick = yield prevEma;
                } else {
                    tick = yield;
                    prevEma = sma.nextValue(tick);
                    if (prevEma) tick = yield prevEma;
                }
            }
        };
        this.generator = genFn();
        this.generator.next();
        this.generator.next();
        priceArray.forEach(tick => {
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
EMA.calculate = ema;
export function ema(input) {
    Indicator.reverseInputs(input);
    const result = new EMA(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/moving_averages/EMA.js