import { ATR } from '../directionalmovement/ATR';

const results = [];

// eslint-disable-next-line import/prefer-default-export
export const Supertrend = {
    calculate: input => {
        const { period, factor, low, high, close } = input;
        const atr = ATR.calculate({
            period,
            high,
            low,
            close,
        });
        const diff = high.length - atr.length;
        const Up = new Array(diff).fill(0);
        const Down = new Array(diff).fill(0);
        const trend = new Array(diff).fill(0);
        const SuperTrend = new Array(diff).fill(0);
        let changeOfTrend;
        let flag;
        let flagh;
        for (let i = diff; i < high.length; i++) {
            const a = atr[i];
            const HL2 = (high[i] + low[i]) / 2;
            Up[i] = HL2 + factor * a;
            Down[i] = HL2 - factor * a;

            if (close[i] > Up[i - 1]) {
                trend[i] = 1;
                if (trend[i - 1] === -1) {
                    changeOfTrend = 1;
                }
            } else if (close[i] < Down[i - 1]) {
                trend[i] = -1;
                if (trend[i - 1] === 1) {
                    changeOfTrend = 1;
                }
            } else if (trend[i - 1] === 1) {
                trend[i] = 1;
                changeOfTrend = 0;
            } else if (trend[i - 1] === -1) {
                trend[i] = -1;
                changeOfTrend = 0;
            }

            flag = trend[i] < 0 && trend[i - 1] > 0 ? 1 : 0;
            flagh = trend[i] > 0 && trend[i - 1] < 0 ? 1 : 0;

            if (trend[i] > 0 && Down[i] < Down[i - 1]) {
                Down[i] = Down[i - 1];
            }

            if (trend[i] < 0 && Up[i] > Up[i - 1]) {
                Up[i] = Up[i - 1];
            }

            if (flag === 1) {
                Up[i] = HL2 + factor * a[i];
            }

            if (flagh === 1) {
                Down[i] = HL2 - factor * a[i];
            }

            if (trend[i] === 1) {
                SuperTrend[i] = Down[i];
                if (changeOfTrend === 1) {
                    SuperTrend[i - 1] = SuperTrend[i - 2];
                    results[i - 1].supertrend = SuperTrend[i - 2];
                    changeOfTrend = 0;
                }
                results[i] = {
                    supertrend: SuperTrend[i],
                    direction : trend[i],
                };
            } else if (trend[i] === -1) {
                SuperTrend[i] = Up[i];
                if (changeOfTrend === 1) {
                    SuperTrend[i - 1] = SuperTrend[i - 2];
                    results[i - 1].supertrend = SuperTrend[i - 2];
                    changeOfTrend = 0;
                }
                results[i] = {
                    supertrend: SuperTrend[i],
                    direction : trend[i],
                };
            }
        }
        return results.filter(a => a !== null);
    },
};

// export class Supertrend {
//     result = [];
//     constructor(input) {
//         const {period, factor, low, high, close} = input;
//         console.log(close.length);
//         const atr = ATR.calculate({period, high, low, close});
//         console.log(atr.length);
//         const values = [];
//         for (let i = 0; i < Math.min(atr.length, high.length) - 1; i++) {
//             const h = high.slice(-i)[0];
//             const l = low.slice(-i)[0];
//             const c = close.slice(-i)[0];
//             const hl2 = (h, l) / 2;
//             if (atr !== undefined) {
//                 const prevLowerBand = hl2 + factor * atr.slice(-i - 1)[0];
//                 const prevUpperBand = hl2 - factor * atr.slice(-i - 1)[0];
//                 let upperBand = hl2 + factor * atr.slice(-i)[0];
//                 let lowerBand = hl2 - factor * atr.slice(-i)[0];
//                 lowerBand = lowerBand > prevLowerBand || c < prevLowerBand ? lowerBand : prevLowerBand;
// 	            upperBand = upperBand < prevUpperBand || c > prevUpperBand ? upperBand : prevUpperBand;
//                 const direction = c > upperBand ? -1 : 1
//                 const st = direction === -1 ? lowerBand : upperBand;
//                 values.unshift({supertrend: st, direction});
//                 // console.log({supertrend: st, direction});
//             }
//         }
//         this.result = values;
//     }

//     static calculate = input => {
//         const {result} = new Supertrend(input);
//         console.log(result.length);
//         return result;
//     }
// }

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/moving_averages/Supertrend.js
