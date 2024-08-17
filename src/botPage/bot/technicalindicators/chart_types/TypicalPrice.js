/**
 * Created by AAravindan on 5/4/16.
 */
import { Indicator, IndicatorInput } from '../indicator/indicator';

export class TypicalPriceInput extends IndicatorInput {}
export class TypicalPrice extends Indicator {
    constructor(input) {
        super(input);
        this.result = [];
        this.generator = (function*() {
            let priceInput = yield;
            while (true) {
                priceInput = yield (priceInput.high + priceInput.low + priceInput.close) / 3;
            }
        })();
        this.generator.next();
        input.low.forEach((tick, index) => {
            const result = this.generator.next({
                high : input.high[index],
                low  : input.low[index],
                close: input.close[index],
            });
            this.result.push(result.value);
        });
    }
    nextValue(price) {
        const result = this.generator.next(price).value;
        return result;
    }
}
TypicalPrice.calculate = typicalprice;
export function typicalprice(input) {
    Indicator.reverseInputs(input);
    const result = new TypicalPrice(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/chart_types/TypicalPrice.js
