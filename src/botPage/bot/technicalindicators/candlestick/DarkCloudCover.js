import CandlestickFinder from './CandlestickFinder';

export default class DarkCloudCover extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'DarkCloudCover';
        this.requiredCount = 2;
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
        const firstdayMidpoint = (firstdaysClose + firstdaysOpen) / 2;
        const isFirstBullish = firstdaysClose > firstdaysOpen;
        const isSecondBearish = seconddaysClose < seconddaysOpen;
        const isDarkCloudPattern =
            seconddaysOpen > firstdaysHigh && seconddaysClose < firstdayMidpoint && seconddaysClose > firstdaysOpen;
        return isFirstBullish && isSecondBearish && isDarkCloudPattern;
    }
}
export function darkcloudcover(data) {
    return new DarkCloudCover().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/DarkCloudCover.js
