import Doji from './Doji';
import CandlestickFinder from './CandlestickFinder';

export default class MorningDojiStar extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'MorningDojiStar';
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
        const dojiExists = new Doji().hasPattern({
            open : [seconddaysOpen],
            close: [seconddaysClose],
            high : [seconddaysHigh],
            low  : [seconddaysLow],
        });
        const isThirdBullish = thirddaysOpen < thirddaysClose;
        const gapExists =
            seconddaysHigh < firstdaysLow &&
            seconddaysLow < firstdaysLow &&
            thirddaysOpen > seconddaysHigh &&
            seconddaysClose < thirddaysOpen;
        const doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint;
        return isFirstBearish && dojiExists && isThirdBullish && gapExists && doesCloseAboveFirstMidpoint;
    }
}
export function morningdojistar(data) {
    return new MorningDojiStar().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/MorningDojiStar.js
