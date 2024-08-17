/**
 * Created by AAravindan on 5/4/16.
 */
import { Indicator, IndicatorInput } from '../indicator/indicator';
import { SMA } from './SMA';
import { EMA } from './EMA';

export class MACDInput extends IndicatorInput {
    constructor(values) {
        super();
        this.values = values;
        this.SimpleMAOscillator = true;
        this.SimpleMASignal = true;
    }
}
export class MACDOutput {}
export class MACD extends Indicator {
    constructor(input) {
        super(input);
        const oscillatorMAtype = input.SimpleMAOscillator ? SMA : EMA;
        const signalMAtype = input.SimpleMASignal ? SMA : EMA;
        const fastMAProducer = new oscillatorMAtype({
            period: input.fastPeriod,
            values: [],
            format: v => v,
        });
        const slowMAProducer = new oscillatorMAtype({
            period: input.slowPeriod,
            values: [],
            format: v => v,
        });
        const signalMAProducer = new signalMAtype({
            period: input.signalPeriod,
            values: [],
            format: v => v,
        });
        const format = this.format;
        this.result = [];
        this.generator = (function*() {
            let index = 0;
            let tick;
            let MACD, signal, histogram, fast, slow;
            while (true) {
                if (index < input.slowPeriod) {
                    tick = yield;
                    fast = fastMAProducer.nextValue(tick);
                    slow = slowMAProducer.nextValue(tick);
                    index++;
                    continue;
                }
                if (fast && slow) {
                    // Just for typescript to be happy
                    MACD = fast - slow;
                    signal = signalMAProducer.nextValue(MACD);
                }
                histogram = MACD - signal;
                tick = yield {
                    // fast : fast,
                    // slow : slow,
                    MACD     : format(MACD),
                    signal   : signal ? format(signal) : undefined,
                    histogram: isNaN(histogram) ? undefined : format(histogram),
                };
                fast = fastMAProducer.nextValue(tick);
                slow = slowMAProducer.nextValue(tick);
            }
        })();
        this.generator.next();
        input.values.forEach(tick => {
            const result = this.generator.next(tick);
            if (result.value != undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price).value;
        return result;
    }
}
MACD.calculate = macd;
export function macd(input) {
    Indicator.reverseInputs(input);
    const result = new MACD(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/moving_averages/MACD.js
