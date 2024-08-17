import CandlestickFinder from './CandlestickFinder';

export default class BearishInvertedHammerStick extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'BearishInvertedHammerStick';
        this.requiredCount = 1;
    }
    logic(data) {
        const daysOpen = data.open[0];
        const daysClose = data.close[0];
        const daysHigh = data.high[0];
        const daysLow = data.low[0];
        let isBearishInvertedHammer = daysOpen > daysClose;
        isBearishInvertedHammer = isBearishInvertedHammer && this.approximateEqual(daysClose, daysLow);
        isBearishInvertedHammer = isBearishInvertedHammer && daysOpen - daysClose <= 2 * (daysHigh - daysOpen);
        return isBearishInvertedHammer;
    }
}
export function bearishinvertedhammerstick(data) {
    return new BearishInvertedHammerStick().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/BearishInvertedHammerStick.js
