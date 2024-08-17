/**
 * Created by AAravindan on 5/17/16.
 */
import { Indicator, IndicatorInput } from '../indicator/indicator';

export class ADLInput extends IndicatorInput {}
export class ADL extends Indicator {
    constructor(input) {
        super(input);
        const highs = input.high;
        const lows = input.low;
        const closes = input.close;
        const volumes = input.volume;
        if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
            throw 'Inputs(low,high, close, volumes) not of equal size';
        }
        this.result = [];
        this.generator = (function*() {
            let result = 0;
            let tick;
            tick = yield;
            while (true) {
                let moneyFlowMultiplier = (tick.close - tick.low - (tick.high - tick.close)) / (tick.high - tick.low);
                moneyFlowMultiplier = isNaN(moneyFlowMultiplier) ? 1 : moneyFlowMultiplier;
                const moneyFlowVolume = moneyFlowMultiplier * tick.volume;
                result += moneyFlowVolume;
                tick = yield Math.round(result);
            }
        })();
        this.generator.next();
        highs.forEach((tickHigh, index) => {
            const tickInput = {
                high  : tickHigh,
                low   : lows[index],
                close : closes[index],
                volume: volumes[index],
            };
            const result = this.generator.next(tickInput);
            if (result.value != undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        return this.generator.next(price).value;
    }
}
ADL.calculate = adl;
export function adl(input) {
    Indicator.reverseInputs(input);
    const result = new ADL(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/volume/ADL.js
