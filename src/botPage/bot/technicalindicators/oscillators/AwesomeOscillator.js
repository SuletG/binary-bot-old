import { Indicator, IndicatorInput } from '../indicator/indicator';
import { SMA } from '../moving_averages/SMA';

export class AwesomeOscillatorInput extends IndicatorInput {}
export class AwesomeOscillator extends Indicator {
    constructor(input) {
        super(input);
        const highs = input.high;
        const lows = input.low;
        const fastPeriod = input.fastPeriod;
        const slowPeriod = input.slowPeriod;
        const slowSMA = new SMA({
            values: [],
            period: slowPeriod,
        });
        const fastSMA = new SMA({
            values: [],
            period: fastPeriod,
        });
        this.result = [];
        this.generator = (function*() {
            let result;
            let tick;
            let medianPrice;
            let slowSmaValue;
            let fastSmaValue;
            tick = yield;
            while (true) {
                medianPrice = (tick.high + tick.low) / 2;
                slowSmaValue = slowSMA.nextValue(medianPrice);
                fastSmaValue = fastSMA.nextValue(medianPrice);
                if (slowSmaValue !== undefined && fastSmaValue !== undefined) {
                    result = fastSmaValue - slowSmaValue;
                }
                tick = yield result;
            }
        })();
        this.generator.next();
        highs.forEach((tickHigh, index) => {
            const tickInput = {
                high: tickHigh,
                low : lows[index],
            };
            const result = this.generator.next(tickInput);
            if (result.value != undefined) {
                this.result.push(this.format(result.value));
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price);
        if (result.value != undefined) {
            return this.format(result.value);
        }
    }
}
AwesomeOscillator.calculate = awesomeoscillator;
export function awesomeoscillator(input) {
    Indicator.reverseInputs(input);
    const result = new AwesomeOscillator(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/oscillators/AwesomeOscillator.js
