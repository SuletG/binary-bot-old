import CandlestickFinder from './CandlestickFinder';

export default class BearishHaramiCross extends CandlestickFinder {
    constructor() {
        super();
        this.requiredCount = 2;
        this.name = 'BearishHaramiCross';
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
        const isBearishHaramiCrossPattern =
            firstdaysOpen < seconddaysOpen &&
            firstdaysClose > seconddaysOpen &&
            firstdaysClose > seconddaysClose &&
            firstdaysOpen < seconddaysLow &&
            firstdaysHigh > seconddaysHigh;
        const isSecondDayDoji = this.approximateEqual(seconddaysOpen, seconddaysClose);
        return isBearishHaramiCrossPattern && isSecondDayDoji;
    }
}
export function bearishharamicross(data) {
    return new BearishHaramiCross().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/BearishHaramiCross.js
