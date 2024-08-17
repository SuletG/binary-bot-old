import CandlestickFinder from './CandlestickFinder';

export default class BearishMarubozu extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'BearishMarubozu';
        this.requiredCount = 1;
    }
    logic(data) {
        const daysOpen = data.open[0];
        const daysClose = data.close[0];
        const daysHigh = data.high[0];
        const daysLow = data.low[0];
        const isBearishMarbozu =
            this.approximateEqual(daysOpen, daysHigh) &&
            this.approximateEqual(daysLow, daysClose) &&
            daysOpen > daysClose &&
            daysOpen > daysLow;
        return isBearishMarbozu;
    }
}
export function bearishmarubozu(data) {
    return new BearishMarubozu().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/BearishMarubozu.js
