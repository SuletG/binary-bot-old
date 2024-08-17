export default Interface =>
    class extends Interface {
        // eslint-disable-next-line class-methods-use-this
        getListsInterface() {
            return {
                getTheHighestValue: (...args) => this.tradeEngine.getTheHighestValue(...args),
                getTheLowestValue : (...args) => this.tradeEngine.getTheLowestValue(...args),
                getIndexWhen      : (...args) => this.tradeEngine.getIndexWhen(...args),
            };
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/ListsInterface.js
