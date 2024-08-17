import CandlestickFinder from './CandlestickFinder';

export default class BearishHammerStick extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'BearishHammerStick';
        this.requiredCount = 1;
    }
    logic(data) {
        const daysOpen = data.open[0];
        const daysClose = data.close[0];
        const daysHigh = data.high[0];
        const daysLow = data.low[0];
        let isBearishHammer = daysOpen > daysClose;
        isBearishHammer = isBearishHammer && this.approximateEqual(daysOpen, daysHigh);
        isBearishHammer = isBearishHammer && daysOpen - daysClose <= 2 * (daysClose - daysLow);
        return isBearishHammer;
    }
}
export function bearishhammerstick(data) {
    return new BearishHammerStick().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/BearishHammerStick.js
