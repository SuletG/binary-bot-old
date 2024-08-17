import { Indicator, IndicatorInput } from '../indicator/indicator';
import { SMA } from '../moving_averages/SMA';
import { ROC } from './ROC';

export class KSTInput extends IndicatorInput {}
export class KSTOutput {}
export class KST extends Indicator {
    constructor(input) {
        super(input);
        const priceArray = input.values;
        const rocPer1 = input.ROCPer1;
        const rocPer2 = input.ROCPer2;
        const rocPer3 = input.ROCPer3;
        const rocPer4 = input.ROCPer4;
        const smaPer1 = input.SMAROCPer1;
        const smaPer2 = input.SMAROCPer2;
        const smaPer3 = input.SMAROCPer3;
        const smaPer4 = input.SMAROCPer4;
        const signalPeriod = input.signalPeriod;
        const roc1 = new ROC({
            period: rocPer1,
            values: [],
        });
        const roc2 = new ROC({
            period: rocPer2,
            values: [],
        });
        const roc3 = new ROC({
            period: rocPer3,
            values: [],
        });
        const roc4 = new ROC({
            period: rocPer4,
            values: [],
        });
        const sma1 = new SMA({
            period: smaPer1,
            values: [],
            format: v => v,
        });
        const sma2 = new SMA({
            period: smaPer2,
            values: [],
            format: v => v,
        });
        const sma3 = new SMA({
            period: smaPer3,
            values: [],
            format: v => v,
        });
        const sma4 = new SMA({
            period: smaPer4,
            values: [],
            format: v => v,
        });
        const signalSMA = new SMA({
            period: signalPeriod,
            values: [],
            format: v => v,
        });
        const format = this.format;
        this.result = [];
        const firstResult = Math.max(rocPer1 + smaPer1, rocPer2 + smaPer2, rocPer3 + smaPer3, rocPer4 + smaPer4);
        this.generator = (function*() {
            let index = 1;
            let tick = yield;
            let kst;
            let RCMA1, RCMA2, RCMA3, RCMA4, signal, result;
            while (true) {
                const roc1Result = roc1.nextValue(tick);
                const roc2Result = roc2.nextValue(tick);
                const roc3Result = roc3.nextValue(tick);
                const roc4Result = roc4.nextValue(tick);
                RCMA1 = roc1Result !== undefined ? sma1.nextValue(roc1Result) : undefined;
                RCMA2 = roc2Result !== undefined ? sma2.nextValue(roc2Result) : undefined;
                RCMA3 = roc3Result !== undefined ? sma3.nextValue(roc3Result) : undefined;
                RCMA4 = roc4Result !== undefined ? sma4.nextValue(roc4Result) : undefined;
                if (index < firstResult) {
                    index++;
                } else {
                    kst = RCMA1 * 1 + RCMA2 * 2 + RCMA3 * 3 + RCMA4 * 4;
                }
                signal = kst !== undefined ? signalSMA.nextValue(kst) : undefined;
                result =
                    kst !== undefined
                        ? {
                            kst   : format(kst),
                            signal: signal ? format(signal) : undefined,
                        }
                        : undefined;
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
        const nextResult = this.generator.next(price);
        if (nextResult.value != undefined) return nextResult.value;
    }
}
KST.calculate = kst;
export function kst(input) {
    Indicator.reverseInputs(input);
    const result = new KST(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/momentum/KST.js
