import { IndicatorInput, Indicator } from '../indicator/indicator';
import LinkedList from '../Utils/FixedSizeLinkedList';

export class WilliamsRInput extends IndicatorInput {}
export class WilliamsR extends Indicator {
    constructor(input) {
        super(input);
        const lows = input.low;
        const highs = input.high;
        const closes = input.close;
        const period = input.period;
        const format = this.format;
        if (!(lows.length === highs.length && highs.length === closes.length)) {
            throw 'Inputs(low,high, close) not of equal size';
        }
        this.result = [];
        // %R = (Highest High - Close)/(Highest High - Lowest Low) * -100
        // Lowest Low = lowest low for the look-back period
        // Highest High = highest high for the look-back period
        // %R is multiplied by -100 correct the inversion and move the decimal.
        this.generator = (function*() {
            let index = 1;
            const pastHighPeriods = new LinkedList(period, true, false);
            const pastLowPeriods = new LinkedList(period, false, true);
            let periodLow;
            let periodHigh;
            let tick = yield;
            let williamsR;
            while (true) {
                pastHighPeriods.push(tick.high);
                pastLowPeriods.push(tick.low);
                if (index < period) {
                    index++;
                    tick = yield;
                    continue;
                }
                periodLow = pastLowPeriods.periodLow;
                periodHigh = pastHighPeriods.periodHigh;
                williamsR = format(((periodHigh - tick.close) / (periodHigh - periodLow)) * -100);
                tick = yield williamsR;
            }
        })();
        this.generator.next();
        lows.forEach((low, index) => {
            const result = this.generator.next({
                high : highs[index],
                low  : lows[index],
                close: closes[index],
            });
            if (result.value !== undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        const nextResult = this.generator.next(price);
        if (nextResult.value != undefined) return this.format(nextResult.value);
    }
}
WilliamsR.calculate = williamsr;
export function williamsr(input) {
    Indicator.reverseInputs(input);
    const result = new WilliamsR(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/momentum/WilliamsR.js
