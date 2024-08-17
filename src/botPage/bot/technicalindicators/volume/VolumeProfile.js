import { Indicator, IndicatorInput } from '../indicator/indicator';

export class VolumeProfileInput extends IndicatorInput {}
export class VolumeProfileOutput {}
export function priceFallsBetweenBarRange(low, high, low1, high1) {
    return (low <= low1 && high >= low1) || (low1 <= low && high1 >= low);
}
export class VolumeProfile extends Indicator {
    constructor(input) {
        super(input);
        const highs = input.high;
        const lows = input.low;
        const closes = input.close;
        const opens = input.open;
        const volumes = input.volume;
        const bars = input.noOfBars;
        if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
            throw 'Inputs(low,high, close, volumes) not of equal size';
        }
        this.result = [];
        const max = Math.max(...highs, ...lows, ...closes, ...opens);
        const min = Math.min(...highs, ...lows, ...closes, ...opens);
        const barRange = (max - min) / bars;
        let lastEnd = min;
        for (let i = 0; i < bars; i++) {
            const rangeStart = lastEnd;
            const rangeEnd = rangeStart + barRange;
            lastEnd = rangeEnd;
            let bullishVolume = 0;
            let bearishVolume = 0;
            let totalVolume = 0;
            for (let priceBar = 0; priceBar < highs.length; priceBar++) {
                const priceBarStart = lows[priceBar];
                const priceBarEnd = highs[priceBar];
                const priceBarOpen = opens[priceBar];
                const priceBarClose = closes[priceBar];
                const priceBarVolume = volumes[priceBar];
                if (priceFallsBetweenBarRange(rangeStart, rangeEnd, priceBarStart, priceBarEnd)) {
                    totalVolume += priceBarVolume;
                    if (priceBarOpen > priceBarClose) {
                        bearishVolume += priceBarVolume;
                    } else {
                        bullishVolume += priceBarVolume;
                    }
                }
            }
            this.result.push({
                rangeStart,
                rangeEnd,
                bullishVolume,
                bearishVolume,
                totalVolume,
            });
        }
    }
    nextValue(price) {
        throw 'Next value not supported for volume profile';
    }
}
VolumeProfile.calculate = volumeprofile;
export function volumeprofile(input) {
    Indicator.reverseInputs(input);
    const result = new VolumeProfile(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/volume/VolumeProfile.js
