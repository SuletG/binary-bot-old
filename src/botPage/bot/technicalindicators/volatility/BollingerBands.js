
import { Indicator, IndicatorInput } from '../indicator/indicator';
import { SMA } from '../moving_averages/SMA';
import { SD } from '../Utils/SD';

export class BollingerBandsInput extends IndicatorInput {}
export class BollingerBandsOutput extends IndicatorInput {}
export class BollingerBands extends Indicator {
    constructor(input) {
        super(input);
        const period = input.period;
        const priceArray = input.values;
        const stdDev = input.stdDev;
        const format = this.format;
        let sma, sd;
        this.result = [];
        sma = new SMA({
            period,
            values: [],
            format: v => v,
        });
        sd = new SD({
            period,
            values: [],
            format: v => v,
        });
        this.generator = (function*() {
            let result;
            let tick;
            let calcSMA;
            let calcsd;
            tick = yield;
            while (true) {
                calcSMA = sma.nextValue(tick);
                calcsd = sd.nextValue(tick);
                if (calcSMA) {
                    const middle = format(calcSMA);
                    const upper = format(calcSMA + calcsd * stdDev);
                    const lower = format(calcSMA - calcsd * stdDev);
                    const pb = format((tick - lower) / (upper - lower));
                    result = {
                        middle,
                        upper,
                        lower,
                        pb,
                    };
                }
                tick = yield result;
            }
        })();
        this.generator.next();
        priceArray.forEach(tick => {
            const result = this.generator.next(tick);
            if (result.value != undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        return this.generator.next(price).value;
    }
}
BollingerBands.calculate = bollingerbands;
export function bollingerbands(input) {
    Indicator.reverseInputs(input);
    const result = new BollingerBands(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/volatility/BollingerBands.js
