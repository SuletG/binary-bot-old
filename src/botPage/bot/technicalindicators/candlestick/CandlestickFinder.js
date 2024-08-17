export default class CandlestickFinder {
    constructor() {
        // if (new.target === Abstract) {
        //     throw new TypeError("Abstract class");
        // }
    }
    approximateEqual(a, b) {
        const left = parseFloat(Math.abs(a - b).toPrecision(4)) * 1;
        const right = parseFloat((a * 0.001).toPrecision(4)) * 1;
        return left <= right;
    }
    logic(data) {
        throw 'this has to be implemented';
    }
    getAllPatternIndex(data) {
        if (data.close.length < this.requiredCount) {
            console.warn('Data count less than data required for the strategy ', this.name);
            return [];
        }
        if (data.reversedInput) {
            data.open.reverse();
            data.high.reverse();
            data.low.reverse();
            data.close.reverse();
        }
        const strategyFn = this.logic;
        return this._generateDataForCandleStick(data)
            .map((current, index) => strategyFn.call(this, current) ? index : undefined)
            .filter(hasIndex => hasIndex);
    }
    hasPattern(data) {
        if (data.close.length < this.requiredCount) {
            console.warn('Data count less than data required for the strategy ', this.name);
            return false;
        }
        if (data.reversedInput) {
            data.open.reverse();
            data.high.reverse();
            data.low.reverse();
            data.close.reverse();
        }
        const strategyFn = this.logic;
        return strategyFn.call(this, this._getLastDataForCandleStick(data));
    }
    _getLastDataForCandleStick(data) {
        const requiredCount = this.requiredCount;
        if (data.close.length === requiredCount) {
            return data;
        } 
        const returnVal = {
            open : [],
            high : [],
            low  : [],
            close: [],
        };
        let i = 0;
        const index = data.close.length - requiredCount;
        while (i < requiredCount) {
            returnVal.open.push(data.open[index + i]);
            returnVal.high.push(data.high[index + i]);
            returnVal.low.push(data.low[index + i]);
            returnVal.close.push(data.close[index + i]);
            i++;
        }
        return returnVal;
        
    }
    _generateDataForCandleStick(data) {
        const requiredCount = this.requiredCount;
        const generatedData = data.close
            .map((currentData, index) => {
                let i = 0;
                const returnVal = {
                    open : [],
                    high : [],
                    low  : [],
                    close: [],
                };
                while (i < requiredCount) {
                    returnVal.open.push(data.open[index + i]);
                    returnVal.high.push(data.high[index + i]);
                    returnVal.low.push(data.low[index + i]);
                    returnVal.close.push(data.close[index + i]);
                    i++;
                }
                return returnVal;
            })
            .filter((val, index) => index <= data.close.length - requiredCount);
        return generatedData;
    }
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/candlestick/CandlestickFinder.js
