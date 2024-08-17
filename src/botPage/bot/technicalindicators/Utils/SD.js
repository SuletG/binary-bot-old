import { IndicatorInput, Indicator } from '../indicator/indicator';
import { SMA } from '../moving_averages/SMA';
import LinkedList from '../Utils/FixedSizeLinkedList';
/**
 * Created by AAravindan on 5/7/16.
 */
('use strict');
export class SDInput extends IndicatorInput {}
export class SD extends Indicator {
    constructor(input) {
        super(input);
        const period = input.period;
        const priceArray = input.values;
        const sma = new SMA({
            period,
            values: [],
            format: v => v,
        });
        this.result = [];
        this.generator = (function*() {
            let tick;
            let mean;
            const currentSet = new LinkedList(period);
            tick = yield;
            let sd;
            while (true) {
                currentSet.push(tick);
                mean = sma.nextValue(tick);
                if (mean) {
                    let sum = 0;
                    for (const x of currentSet.iterator()) {
                        sum += Math.pow(x - mean, 2);
                    }
                    sd = Math.sqrt(sum / period);
                }
                tick = yield sd;
            }
        })();
        this.generator.next();
        priceArray.forEach(tick => {
            const result = this.generator.next(tick);
            if (result.value != undefined) {
                this.result.push(this.format(result.value));
            }
        });
    }
    nextValue(price) {
        const nextResult = this.generator.next(price);
        if (nextResult.value != undefined) return this.format(nextResult.value);
    }
}
SD.calculate = sd;
export function sd(input) {
    Indicator.reverseInputs(input);
    const result = new SD(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/Utils/SD.js
