import CandlestickFinder from './CandlestickFinder';

export default class PiercingLine extends CandlestickFinder {
    constructor() {
        super();
        this.requiredCount = 2;
        this.name = 'PiercingLine';
    }
    logic(data) {
        const firstdaysOpen = data.open[0];
        const firstdaysClose = data.close[0];
        const firstdaysHigh = data.high[0];
        const firstdaysLow = data.low[0];
        const seconddaysOpen = data.open[1];
        const seconddaysClose = data.close[1];
        const seconddaysHigh = data.high[1];
        const seconddaysLow = data.low[1];
        const firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
        const isDowntrend = seconddaysLow < firstdaysLow;
        const isFirstBearish = firstdaysClose < firstdaysOpen;
        const isSecondBullish = seconddaysClose > seconddaysOpen;
        const isPiercingLinePattern = firstdaysLow > seconddaysOpen && seconddaysClose > firstdaysMidpoint;
        return isDowntrend && isFirstBearish && isPiercingLinePattern && isSecondBullish;
    }
}
export function piercingline(data) {
    return new PiercingLine().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/PiercingLine.js
