import CandlestickFinder from './CandlestickFinder';

export default class BullishSpinningTop extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'BullishSpinningTop';
        this.requiredCount = 1;
    }
    logic(data) {
        const daysOpen = data.open[0];
        const daysClose = data.close[0];
        const daysHigh = data.high[0];
        const daysLow = data.low[0];
        const bodyLength = Math.abs(daysClose - daysOpen);
        const upperShadowLength = Math.abs(daysHigh - daysClose);
        const lowerShadowLength = Math.abs(daysOpen - daysLow);
        const isBullishSpinningTop = bodyLength < upperShadowLength && bodyLength < lowerShadowLength;
        return isBullishSpinningTop;
    }
}
export function bullishspinningtop(data) {
    return new BullishSpinningTop().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/BullishSpinningTop.js
