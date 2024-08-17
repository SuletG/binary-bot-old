import { IndicatorInput, Indicator } from '../indicator/indicator';
import { SMA } from '../moving_averages/SMA';
import { RSI } from '../oscillators/RSI';
import { Stochastic } from '../momentum/Stochastic';
/**
 * Created by AAravindan on 5/10/16.
 */
('use strict');
export class StochasticRsiInput extends IndicatorInput {}
export class StochasticRSIOutput {}
export class StochasticRSI extends Indicator {
    constructor(input) {
        super(input);
        const closes = input.values;
        const rsiPeriod = input.rsiPeriod;
        const stochasticPeriod = input.stochasticPeriod;
        const kPeriod = input.kPeriod;
        const dPeriod = input.dPeriod;
        const format = this.format;
        this.result = [];
        this.generator = (function*() {
            const index = 1;
            const rsi = new RSI({
                period: rsiPeriod,
                values: [],
            });
            const stochastic = new Stochastic({
                period      : stochasticPeriod,
                high        : [],
                low         : [],
                close       : [],
                signalPeriod: kPeriod,
            });
            const dSma = new SMA({
                period: dPeriod,
                values: [],
                format: v => v,
            });
            let lastRSI, stochasticRSI, d, result;
            let tick = yield;
            while (true) {
                lastRSI = rsi.nextValue(tick);
                if (lastRSI !== undefined) {
                    const stochasticInput = {
                        high : lastRSI,
                        low  : lastRSI,
                        close: lastRSI,
                    };
                    stochasticRSI = stochastic.nextValue(stochasticInput);
                    if (stochasticRSI !== undefined && stochasticRSI.d !== undefined) {
                        d = dSma.nextValue(stochasticRSI.d);
                        if (d !== undefined)
                        {result = {
                            stochRSI: stochasticRSI.k,
                            k       : stochasticRSI.d,
                            d,
                        };}
                    }
                }
                tick = yield result;
            }
        })();
        this.generator.next();
        closes.forEach((tick, index) => {
            const result = this.generator.next(tick);
            if (result.value !== undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(input) {
        const nextResult = this.generator.next(input);
        if (nextResult.value !== undefined) return nextResult.value;
    }
}
StochasticRSI.calculate = stochasticrsi;
export function stochasticrsi(input) {
    Indicator.reverseInputs(input);
    const result = new StochasticRSI(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/momentum/StochasticRSI.js
