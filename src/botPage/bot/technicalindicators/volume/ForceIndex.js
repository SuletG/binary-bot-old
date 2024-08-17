import { EMA } from '../moving_averages/EMA';
import { Indicator, IndicatorInput } from '../indicator/indicator';

export class ForceIndexInput extends IndicatorInput {
    constructor() {
        super(...arguments);
        this.period = 1;
    }
}
export class ForceIndex extends Indicator {
    constructor(input) {
        super(input);
        const closes = input.close;
        const volumes = input.volume;
        const period = input.period || 1;
        if (!(volumes.length === closes.length)) {
            throw 'Inputs(volume, close) not of equal size';
        }
        const emaForceIndex = new EMA({
            values: [],
            period,
        });
        this.result = [];
        this.generator = (function*() {
            let previousTick = yield;
            let tick = yield;
            let forceIndex;
            while (true) {
                forceIndex = (tick.close - previousTick.close) * tick.volume;
                previousTick = tick;
                tick = yield emaForceIndex.nextValue(forceIndex);
            }
        })();
        this.generator.next();
        volumes.forEach((tick, index) => {
            const result = this.generator.next({
                close : closes[index],
                volume: volumes[index],
            });
            if (result.value != undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price).value;
        if (result != undefined) {
            return result;
        }
    }
}
ForceIndex.calculate = forceindex;
export function forceindex(input) {
    Indicator.reverseInputs(input);
    const result = new ForceIndex(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/volume/ForceIndex.js
