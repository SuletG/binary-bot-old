import CandlestickFinder from './CandlestickFinder';

export default class BearishSpinningTop extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'BearishSpinningTop';
        this.requiredCount = 1;
    }
    logic(data) {
        const daysOpen = data.open[0];
        const daysClose = data.close[0];
        const daysHigh = data.high[0];
        const daysLow = data.low[0];
        const bodyLength = Math.abs(daysClose - daysOpen);
        const upperShadowLength = Math.abs(daysHigh - daysOpen);
        const lowerShadowLength = Math.abs(daysHigh - daysLow);
        const isBearishSpinningTop = bodyLength < upperShadowLength && bodyLength < lowerShadowLength;
        return isBearishSpinningTop;
    }
}
export function bearishspinningtop(data) {
    return new BearishSpinningTop().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/BearishSpinningTop.js
