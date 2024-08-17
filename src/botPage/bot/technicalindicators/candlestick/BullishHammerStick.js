import CandlestickFinder from './CandlestickFinder';

export default class BullishHammerStick extends CandlestickFinder {
    constructor() {
        super();
        this.name = 'BullishHammerStick';
        this.requiredCount = 1;
    }
    logic(data) {
        const daysOpen = data.open[0];
        const daysClose = data.close[0];
        const daysHigh = data.high[0];
        const daysLow = data.low[0];
        let isBullishHammer = daysClose > daysOpen;
        isBullishHammer = isBullishHammer && this.approximateEqual(daysClose, daysHigh);

        if (isBullishHammer) {
            console.log(isBullishHammer);
        }
        isBullishHammer = isBullishHammer && daysClose - daysOpen <= 2 * (daysOpen - daysLow);
        return isBullishHammer;
    }
}
export function bullishhammerstick(data) {
    return new BullishHammerStick().hasPattern(data);
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/BullishHammerStick.js
