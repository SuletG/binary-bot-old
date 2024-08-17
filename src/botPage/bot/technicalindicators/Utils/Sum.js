import { Indicator, IndicatorInput } from '../indicator/indicator';
import FixedSizedLinkedList from './FixedSizeLinkedList';

export class SumInput extends IndicatorInput {}
export class Sum extends Indicator {
    constructor(input) {
        super(input);
        const values = input.values;
        const period = input.period;
        this.result = [];
        const periodList = new FixedSizedLinkedList(period, false, false, true);
        this.generator = (function*() {
            let result;
            let tick;
            let high;
            tick = yield;
            while (true) {
                periodList.push(tick);
                if (periodList.totalPushed >= period) {
                    high = periodList.periodSum;
                }
                tick = yield high;
            }
        })();
        this.generator.next();
        values.forEach((value, index) => {
            const result = this.generator.next(value);
            if (result.value != undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price);
        if (result.value != undefined) {
            return result.value;
        }
    }
}
Sum.calculate = sum;
export function sum(input) {
    Indicator.reverseInputs(input);
    const result = new Sum(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/Utils/Sum.js
