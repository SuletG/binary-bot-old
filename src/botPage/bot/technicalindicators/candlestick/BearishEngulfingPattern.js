import CandlestickFinder from './CandlestickFinder';

export default class BearishEngulfingPattern extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'BearishEngulfingPattern';
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
        const isBearishEngulfing =
            firstdaysClose > firstdaysOpen &&
            firstdaysOpen < seconddaysOpen &&
            firstdaysClose < seconddaysOpen &&
            firstdaysOpen > seconddaysClose;
        return isBearishEngulfing;
    }
}
export function bearishengulfingpattern(data) {
    return new BearishEngulfingPattern().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/BearishEngulfingPattern.js
