import CandlestickFinder from './CandlestickFinder';

export default class EveningStar extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'EveningStar';
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
        const isFirstBullish = firstdaysClose > firstdaysOpen;
        const isSmallBodyExists = firstdaysHigh < seconddaysLow && firstdaysHigh < seconddaysHigh;
        const isThirdBearish = thirddaysOpen > thirddaysClose;
        const gapExists =
            seconddaysHigh > firstdaysHigh &&
            seconddaysLow > firstdaysHigh &&
            thirddaysOpen < seconddaysLow &&
            seconddaysClose > thirddaysOpen;
        const doesCloseBelowFirstMidpoint = thirddaysClose < firstdaysMidpoint;
        return isFirstBullish && isSmallBodyExists && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint;
    }
}
export function eveningstar(data) {
    return new EveningStar().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/EveningStar.js
