export default Interface =>
    class extends Interface {
        // eslint-disable-next-line class-methods-use-this
        getDigitsInterface() {
            return {
                getMostFrequentDigit   : (...args) => this.tradeEngine.getMostFrequentDigit(...args),
                getLeastFrequentDigit  : (...args) => this.tradeEngine.getLeastFrequentDigit(...args),
                getLastDigit           : (...args) => this.tradeEngine.getLastDigit(...args),
                getDigitsPercentage    : (...args) => this.tradeEngine.getDigitsPercentage(...args),
                getEvenOddAmount       : (...args) => this.tradeEngine.getEvenOddAmount(...args),
                getLastDigitList       : (...args) => this.tradeEngine.getLastDigitList(...args),
                areTheLastDigitsTheSame: (...args) => this.tradeEngine.areTheLastDigitsTheSame(...args),
                getDecimals            : () => this.tradeEngine.getDecimals(),
            };
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/DigitsInterface.js
