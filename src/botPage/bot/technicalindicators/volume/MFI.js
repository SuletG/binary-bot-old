/**
 * Created by AAravindan on 5/17/16.
 */
import { Indicator, IndicatorInput } from '../indicator/indicator';
import { TypicalPrice } from '../chart_types/TypicalPrice';
import FixedSizeLinkedList from '../Utils/FixedSizeLinkedList';

export class MFIInput extends IndicatorInput {}
export class MFI extends Indicator {
    constructor(input) {
        super(input);
        const highs = input.high;
        const lows = input.low;
        const closes = input.close;
        const volumes = input.volume;
        const period = input.period;
        const typicalPrice = new TypicalPrice({
            low  : [],
            high : [],
            close: [],
        });
        const positiveFlow = new FixedSizeLinkedList(period, false, false, true);
        const negativeFlow = new FixedSizeLinkedList(period, false, false, true);
        if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
            throw 'Inputs(low,high, close, volumes) not of equal size';
        }
        this.result = [];
        this.generator = (function*() {
            let result;
            let tick;
            let lastClose;
            let positiveFlowForPeriod;
            let rawMoneyFlow = 0;
            let moneyFlowRatio;
            let negativeFlowForPeriod;
            let typicalPriceValue = null;
            let prevousTypicalPrice = null;
            tick = yield;
            lastClose = tick.close; // Fist value
            tick = yield;
            while (true) {
                const { high, low, close, volume } = tick;
                let positionMoney = 0;
                let negativeMoney = 0;
                typicalPriceValue = typicalPrice.nextValue({
                    high,
                    low,
                    close,
                });
                rawMoneyFlow = typicalPriceValue * volume;
                if (typicalPriceValue != null && prevousTypicalPrice != null) {
                    typicalPriceValue > prevousTypicalPrice
                        ? (positionMoney = rawMoneyFlow)
                        : (negativeMoney = rawMoneyFlow);
                    positiveFlow.push(positionMoney);
                    negativeFlow.push(negativeMoney);
                    positiveFlowForPeriod = positiveFlow.periodSum;
                    negativeFlowForPeriod = negativeFlow.periodSum;
                    if (positiveFlow.totalPushed >= period && positiveFlow.totalPushed >= period) {
                        moneyFlowRatio = positiveFlowForPeriod / negativeFlowForPeriod;
                        result = 100 - 100 / (1 + moneyFlowRatio);
                    }
                }
                prevousTypicalPrice = typicalPriceValue;
                tick = yield result;
            }
        })();
        this.generator.next();
        highs.forEach((tickHigh, index) => {
            const tickInput = {
                high  : tickHigh,
                low   : lows[index],
                close : closes[index],
                volume: volumes[index],
            };
            const result = this.generator.next(tickInput);
            if (result.value != undefined) {
                this.result.push(parseFloat(result.value.toFixed(2)));
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price);
        if (result.value != undefined) {
            return parseFloat(result.value.toFixed(2));
        }
    }
}
MFI.calculate = mfi;
export function mfi(input) {
    Indicator.reverseInputs(input);
    const result = new MFI(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/volume/MFI.js
