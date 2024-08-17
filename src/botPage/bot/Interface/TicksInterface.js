import DigitsInterface from './DigitsInterface';
import PatternsInterface from './PatternsInterface';

export default Interface =>
    class extends PatternsInterface(DigitsInterface(Interface)) {
        getTicksInterface() {
            return {
                getLastTick           : (...args) => this.tradeEngine.getLastTick(...args),
                getTicks              : (...args) => this.tradeEngine.getTicks(...args),
                checkDirection        : (...args) => this.tradeEngine.checkDirection(...args),
                getOhlcFromEnd        : (...args) => this.tradeEngine.getOhlcFromEnd(...args),
                getOhlc               : (...args) => this.tradeEngine.getOhlc(...args),
                getCandleBody         : (...args) => this.tradeEngine.getCandleBody(...args),
                getCandleRange        : (...args) => this.tradeEngine.getCandleRange(...args),
                getCandleWick         : (...args) => this.tradeEngine.getCandleWick(...args),
                getCandleUpperWick    : (...args) => this.tradeEngine.getCandleUpperWick(...args),
                getCandleLowerWick    : (...args) => this.tradeEngine.getCandleLowerWick(...args),
                checkCross            : (...args) => this.tradeEngine.checkCross(...args),
                getSupportResistance  : (...args) => this.tradeEngine.getSupportResistance(...args),
                amountOfTicksDirection: (...args) => this.tradeEngine.amountOfTicksDirection(...args),
                ...this.getDigitsInterface(),
                ...this.getPatternsInterface(),
            };
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/TicksInterface.js
