import { Indicator, IndicatorInput } from '../indicator/indicator';
import LinkedList from '../Utils/FixedSizeLinkedList';

export class IchimokuCloudInput extends IndicatorInput {
    constructor() {
        super(...arguments);
        this.conversionPeriod = 9;
        this.basePeriod = 26;
        this.spanPeriod = 52;
        this.displacement = 26;
    }
}
export class IchimokuCloudOutput {}
export class IchimokuCloud extends Indicator {
    constructor(input) {
        super(input);
        this.result = [];
        const defaults = {
            conversionPeriod: 9,
            basePeriod      : 26,
            spanPeriod      : 52,
            displacement    : 26,
        };
        const params = Object.assign({}, defaults, input);
        const currentConversionData = new LinkedList(params.conversionPeriod * 2, true, true, false);
        const currentBaseData = new LinkedList(params.basePeriod * 2, true, true, false);
        const currenSpanData = new LinkedList(params.spanPeriod * 2, true, true, false);
        this.generator = (function*() {
            let result;
            let tick;
            const period = Math.max(params.conversionPeriod, params.basePeriod, params.spanPeriod, params.displacement);
            let periodCounter = 1;
            tick = yield;
            while (true) {
                // Keep a list of lows/highs for the max period
                currentConversionData.push(tick.high);
                currentConversionData.push(tick.low);
                currentBaseData.push(tick.high);
                currentBaseData.push(tick.low);
                currenSpanData.push(tick.high);
                currenSpanData.push(tick.low);
                if (periodCounter < period) {
                    periodCounter++;
                } else {
                    // Tenkan-sen (ConversionLine): (9-period high + 9-period low)/2))
                    const conversionLine = (currentConversionData.periodHigh + currentConversionData.periodLow) / 2;
                    // Kijun-sen (Base Line): (26-period high + 26-period low)/2))
                    const baseLine = (currentBaseData.periodHigh + currentBaseData.periodLow) / 2;
                    // Senkou Span A (Leading Span A): (Conversion Line + Base Line)/2))
                    const spanA = (conversionLine + baseLine) / 2;
                    // Senkou Span B (Leading Span B): (52-period high + 52-period low)/2))
                    const spanB = (currenSpanData.periodHigh + currenSpanData.periodLow) / 2;
                    // Senkou Span A / Senkou Span B offset by 26 periods
                    // if(spanCounter < params.displacement) {
                    // 	spanCounter++
                    // } else {
                    // 	spanA = spanAs.shift()
                    // 	spanB = spanBs.shift()
                    // }
                    result = {
                        conversion: conversionLine,
                        base      : baseLine,
                        spanA,
                        spanB,
                    };
                }
                tick = yield result;
            }
        })();
        this.generator.next();
        input.low.forEach((tick, index) => {
            const result = this.generator.next({
                high: input.high[index],
                low : input.low[index],
            });
            if (result.value) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        return this.generator.next(price).value;
    }
}
IchimokuCloud.calculate = ichimokucloud;
export function ichimokucloud(input) {
    Indicator.reverseInputs(input);
    const result = new IchimokuCloud(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/ichimoku/IchimokuCloud.js
