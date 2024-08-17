import { Indicator, IndicatorInput } from '../indicator/indicator';
import LinkedList from '../Utils/FixedSizeLinkedList';

export class ROCInput extends IndicatorInput {}
export class ROC extends Indicator {
    constructor(input) {
        super(input);
        const period = input.period;
        const priceArray = input.values;
        this.result = [];
        this.generator = (function*() {
            let index = 1;
            const pastPeriods = new LinkedList(period);
            let tick = yield;
            let roc;
            while (true) {
                pastPeriods.push(tick);
                if (index < period) {
                    index++;
                } else {
                    roc = ((tick - pastPeriods.lastShift) / pastPeriods.lastShift) * 100;
                }
                tick = yield roc;
            }
        })();
        this.generator.next();
        priceArray.forEach(tick => {
            const result = this.generator.next(tick);
            if (result.value != undefined && !isNaN(result.value)) {
                this.result.push(this.format(result.value));
            }
        });
    }
    nextValue(price) {
        const nextResult = this.generator.next(price);
        if (nextResult.value != undefined && !isNaN(nextResult.value)) {
            return this.format(nextResult.value);
        }
    }
}
ROC.calculate = roc;
export function roc(input) {
    Indicator.reverseInputs(input);
    const result = new ROC(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/momentum/ROC.js
