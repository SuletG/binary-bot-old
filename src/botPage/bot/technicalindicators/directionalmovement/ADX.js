import { WilderSmoothing } from '../moving_averages/WilderSmoothing';
import { Indicator, IndicatorInput } from '../indicator/indicator';
import { MDM } from './MinusDM';
import { PDM } from './PlusDM';
import { TrueRange } from './TrueRange';
import { WEMA } from '../moving_averages/WEMA';

export class ADXInput extends IndicatorInput {}
export class ADXOutput extends IndicatorInput {}
export class ADX extends Indicator {
    constructor(input) {
        super(input);
        const lows = input.low;
        const highs = input.high;
        const closes = input.close;
        const period = input.period;
        const format = this.format;
        const plusDM = new PDM({
            high: [],
            low : [],
        });
        const minusDM = new MDM({
            high: [],
            low : [],
        });
        const emaPDM = new WilderSmoothing({
            period,
            values: [],
            format: v => v,
        });
        const emaMDM = new WilderSmoothing({
            period,
            values: [],
            format: v => v,
        });
        const emaTR = new WilderSmoothing({
            period,
            values: [],
            format: v => v,
        });
        const emaDX = new WEMA({
            period,
            values: [],
            format: v => v,
        });
        const tr = new TrueRange({
            low  : [],
            high : [],
            close: [],
        });
        if (!(lows.length === highs.length && highs.length === closes.length)) {
            throw 'Inputs(low,high, close) not of equal size';
        }
        this.result = [];
        ADXOutput;
        this.generator = (function*() {
            let tick = yield;
            const index = 0;
            let lastATR, lastAPDM, lastAMDM, lastPDI, lastMDI, lastDX, smoothedDX;
            lastATR = 0;
            lastAPDM = 0;
            lastAMDM = 0;
            while (true) {
                const calcTr = tr.nextValue(tick);
                const calcPDM = plusDM.nextValue(tick);
                const calcMDM = minusDM.nextValue(tick);
                if (calcTr === undefined) {
                    tick = yield;
                    continue;
                }
                const lastATR = emaTR.nextValue(calcTr);
                const lastAPDM = emaPDM.nextValue(calcPDM);
                const lastAMDM = emaMDM.nextValue(calcMDM);
                if (lastATR != undefined && lastAPDM != undefined && lastAMDM != undefined) {
                    lastPDI = (lastAPDM * 100) / lastATR;
                    lastMDI = (lastAMDM * 100) / lastATR;
                    const diDiff = Math.abs(lastPDI - lastMDI);
                    const diSum = lastPDI + lastMDI;
                    lastDX = (diDiff / diSum) * 100;
                    smoothedDX = emaDX.nextValue(lastDX);
                    // console.log(tick.high.toFixed(2), tick.low.toFixed(2), tick.close.toFixed(2) , calcTr.toFixed(2), calcPDM.toFixed(2), calcMDM.toFixed(2), lastATR.toFixed(2), lastAPDM.toFixed(2), lastAMDM.toFixed(2), lastPDI.toFixed(2), lastMDI.toFixed(2), diDiff.toFixed(2), diSum.toFixed(2), lastDX.toFixed(2));
                }
                tick = yield {
                    adx: smoothedDX,
                    pdi: lastPDI,
                    mdi: lastMDI,
                };
            }
        })();
        this.generator.next();
        lows.forEach((tick, index) => {
            const result = this.generator.next({
                high : highs[index],
                low  : lows[index],
                close: closes[index],
            });
            if (result.value != undefined && result.value.adx != undefined) {
                this.result.push({
                    adx: format(result.value.adx),
                    pdi: format(result.value.pdi),
                    mdi: format(result.value.mdi),
                });
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price).value;
        if (result != undefined && result.adx != undefined) {
            return {
                adx: this.format(result.adx),
                pdi: this.format(result.pdi),
                mdi: this.format(result.mdi),
            };
        }
    }
}
ADX.calculate = adx;
export function adx(input) {
    Indicator.reverseInputs(input);
    const result = new ADX(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/directionalmovement/ADX.js
