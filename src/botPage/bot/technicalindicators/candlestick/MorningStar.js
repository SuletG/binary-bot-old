import CandlestickFinder from './CandlestickFinder';

export default class MorningStar extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'MorningStar';
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
        const firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
        const isFirstBearish = firstdaysClose < firstdaysOpen;
        const isSmallBodyExists = firstdaysLow > seconddaysLow && firstdaysLow > seconddaysHigh;
        const isThirdBullish = thirddaysOpen < thirddaysClose;
        const gapExists =
            seconddaysHigh < firstdaysLow &&
            seconddaysLow < firstdaysLow &&
            thirddaysOpen > seconddaysHigh &&
            seconddaysClose < thirddaysOpen;
        const doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint;
        return isFirstBearish && isSmallBodyExists && gapExists && isThirdBullish && doesCloseAboveFirstMidpoint;
    }
}
export function morningstar(data) {
    return new MorningStar().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/MorningStar.js
