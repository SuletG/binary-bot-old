import CandlestickFinder from './CandlestickFinder';

export default class GraveStoneDoji extends CandlestickFinder {
    constructor() {
        super();
        this.requiredCount = 1;
        this.name = 'GraveStoneDoji';
    }
    logic(data) {
        const daysOpen = data.open[0];
        const daysClose = data.close[0];
        const daysHigh = data.high[0];
        const daysLow = data.low[0];
        const isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
        const isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(daysOpen, daysHigh);
        const isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(daysClose, daysLow);
        return isOpenEqualsClose && isLowEqualsClose && !isHighEqualsOpen;
    }
}
export function gravestonedoji(data) {
    return new GraveStoneDoji().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/GraveStoneDoji.js
