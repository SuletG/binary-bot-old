import CandlestickFinder from './CandlestickFinder';

export default class DownsideTasukiGap extends CandlestickFinder {
    constructor() {
        super();
        this.requiredCount = 3;
        this.name = 'DownsideTasukiGap';
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
        const thirddaysOpen = data.open[2];
        const thirddaysClose = data.close[2];
        const thirddaysHigh = data.high[2];
        const thirddaysLow = data.low[2];
        const isFirstBearish = firstdaysClose < firstdaysOpen;
        const isSecondBearish = seconddaysClose < seconddaysOpen;
        const isThirdBullish = thirddaysClose > thirddaysOpen;
        const isFirstGapExists = seconddaysHigh < firstdaysLow;
        const isDownsideTasukiGap =
            seconddaysOpen > thirddaysOpen &&
            seconddaysClose < thirddaysOpen &&
            thirddaysClose > seconddaysOpen &&
            thirddaysClose < firstdaysClose;
        return isFirstBearish && isSecondBearish && isThirdBullish && isFirstGapExists && isDownsideTasukiGap;
    }
}
export function downsidetasukigap(data) {
    return new DownsideTasukiGap().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/DownsideTasukiGap.js
