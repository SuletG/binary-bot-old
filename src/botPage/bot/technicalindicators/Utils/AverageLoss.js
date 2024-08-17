import { Indicator, IndicatorInput } from '../indicator/indicator';

export class AvgLossInput extends IndicatorInput {}
export class AverageLoss extends Indicator {
    constructor(input) {
        super(input);
        const values = input.values;
        const period = input.period;
        const format = this.format;
        this.generator = (function*(period) {
            let currentValue = yield;
            let counter = 1;
            let lossSum = 0;
            let avgLoss;
            let loss;
            let lastValue = currentValue;
            currentValue = yield;
            while (true) {
                loss = lastValue - currentValue;
                loss = loss > 0 ? loss : 0;
                if (loss > 0) {
                    lossSum += loss;
                }
                if (counter < period) {
                    counter++;
                } else if (avgLoss === undefined) {
                    avgLoss = lossSum / period;
                } else {
                    avgLoss = (avgLoss * (period - 1) + loss) / period;
                }
                lastValue = currentValue;
                avgLoss = avgLoss !== undefined ? format(avgLoss) : undefined;
                currentValue = yield avgLoss;
            }
        })(period);
        this.generator.next();
        this.result = [];
        values.forEach(tick => {
            const result = this.generator.next(tick);
            if (result.value !== undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        return this.generator.next(price).value;
    }
}
AverageLoss.calculate = averageloss;
export function averageloss(input) {
    Indicator.reverseInputs(input);
    const result = new AverageLoss(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/Utils/AverageLoss.js
