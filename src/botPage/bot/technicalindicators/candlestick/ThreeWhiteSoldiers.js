import CandlestickFinder from './CandlestickFinder';

export default class ThreeWhiteSoldiers extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'ThreeWhiteSoldiers';
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
        const isUpTrend = seconddaysHigh > firstdaysHigh && thirddaysHigh > seconddaysHigh;
        const isAllBullish =
            firstdaysOpen < firstdaysClose && seconddaysOpen < seconddaysClose && thirddaysOpen < thirddaysClose;
        const doesOpenWithinPreviousBody =
            firstdaysClose > seconddaysOpen &&
            seconddaysOpen < firstdaysHigh &&
            seconddaysHigh > thirddaysOpen &&
            thirddaysOpen < seconddaysClose;
        return isUpTrend && isAllBullish && doesOpenWithinPreviousBody;
    }
}
export function threewhitesoldiers(data) {
    return new ThreeWhiteSoldiers().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/ThreeWhiteSoldiers.js
