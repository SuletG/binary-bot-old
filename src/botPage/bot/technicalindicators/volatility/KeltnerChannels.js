import { Indicator, IndicatorInput } from '../indicator/indicator';
import { SMA } from '../moving_averages/SMA';
import { EMA } from '../moving_averages/EMA';
import { ATR } from '../directionalmovement/ATR';

export class KeltnerChannelsInput extends IndicatorInput {
    constructor(maPeriod, atrPeriod, useSMA, multiplier) {
        super();
        this.maPeriod = maPeriod;
        this.atrPeriod = atrPeriod;
        this.useSMA = useSMA;
        this.multiplier = multiplier;
    }
}
export class KeltnerChannels extends Indicator {
    result = [];
    constructor(input) {
        super(input);
        const MaType = input.useSMA ? SMA : EMA;
        const maProducer = new MaType({
            period: input.maPeriod,
            values: [],
            format: v => v,
        });
        const atrProducer = new ATR({
            period: input.atrPeriod,
            high  : [],
            low   : [],
            close : [],
            format: v => v,
        });
        let tick;
        const genFn = function*() {
            let result;
            tick = yield;
            while (true) {
                const { close } = tick;
                const ma = maProducer.nextValue(close);
                const atr = atrProducer.nextValue(tick);
                if (ma !== undefined && atr !== undefined) {
                    result = {
                        middle: ma,
                        upper : ma + input.multiplier * atr,
                        lower : ma - input.multiplier * atr,
                    };
                }
                tick = yield result;
            }
        };
        this.generator = genFn();
        this.generator.next();
        const highs = input.high;
        highs.forEach((tickHigh, index) => {
            const tickInput = {
                high : tickHigh,
                low  : input.low[index],
                close: input.close[index],
            };
            const result = this.generator.next(tickInput);
            if (result.value !== undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price);
        if (result.value !== undefined) {
            return result.value;
        }
    }
}
KeltnerChannels.calculate = keltnerchannels;
export function keltnerchannels(input) {
    Indicator.reverseInputs(input);
    const { result } = new KeltnerChannels(input);
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/volatility/KeltnerChannels.js
