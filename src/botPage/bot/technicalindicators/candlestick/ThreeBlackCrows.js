import CandlestickFinder from './CandlestickFinder';

export default class ThreeBlackCrows extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'ThreeBlackCrows';
        this.requiredCount = 3;
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
        const isDownTrend = firstdaysLow > seconddaysLow && seconddaysLow > thirddaysLow;
        const isAllBearish =
            firstdaysOpen > firstdaysClose && seconddaysOpen > seconddaysClose && thirddaysOpen > thirddaysClose;
        const doesOpenWithinPreviousBody =
            firstdaysOpen > seconddaysOpen &&
            seconddaysOpen > firstdaysClose &&
            seconddaysOpen > thirddaysOpen &&
            thirddaysOpen > seconddaysClose;
        return isDownTrend && isAllBearish && doesOpenWithinPreviousBody;
    }
}
export function threeblackcrows(data) {
    return new ThreeBlackCrows().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/ThreeBlackCrows.js
