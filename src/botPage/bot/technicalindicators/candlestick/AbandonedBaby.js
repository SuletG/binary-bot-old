import CandlestickFinder from './CandlestickFinder';
import Doji from './Doji';

export default class AbandonedBaby extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'AbandonedBaby';
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
        const isFirstBearish = firstdaysClose < firstdaysOpen;
        const dojiExists = new Doji().hasPattern({
            open : [seconddaysOpen],
            close: [seconddaysClose],
            high : [seconddaysHigh],
            low  : [seconddaysLow],
        });
        const gapExists =
            seconddaysHigh < firstdaysLow && thirddaysLow > seconddaysHigh && thirddaysClose > thirddaysOpen;
        const isThirdBullish = thirddaysHigh < firstdaysOpen;
        return isFirstBearish && dojiExists && gapExists && isThirdBullish;
    }
}
export function abandonedbaby(data) {
    return new AbandonedBaby().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/AbandonedBaby.js
