import CandlestickFinder from './CandlestickFinder';
import { averageloss } from '../Utils/AverageLoss';
import { averagegain } from '../Utils/AverageGain';

export default class TweezerBottom extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'TweezerBottom';
        this.requiredCount = 5;
    }
    logic(data) {
        return this.downwardTrend(data) && data.low[3] == data.low[4];
    }
    downwardTrend(data) {
        // Analyze trends in closing prices of the first three or four candlesticks
        const gains = averagegain({
            values: data.close.slice(0, 3),
            period: 2,
        });
        const losses = averageloss({
            values: data.close.slice(0, 3),
            period: 2,
        });
        // Downward trend, so more losses than gains
        return losses > gains;
    }
}
export function tweezerbottom(data) {
    return new TweezerBottom().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/TweezerBottom.js
