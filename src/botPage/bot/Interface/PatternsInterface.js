export default Interface =>
    class extends Interface {
        // eslint-disable-next-line class-methods-use-this
        getPatternsInterface() {
            return {
                isHammerPattern           : (...args) => this.tradeEngine.isHammerPattern(...args),
                isShootingStarPattern     : (...args) => this.tradeEngine.isShootingStarPattern(...args),
                isInvertedHammerPattern   : (...args) => this.tradeEngine.isInvertedHammerPattern(...args),
                isHangingManPattern       : (...args) => this.tradeEngine.isHangingManPattern(...args),
                isBullishEngulfing        : (...args) => this.tradeEngine.isBullishEngulfing(...args),
                isBearishEngulfing        : (...args) => this.tradeEngine.isBearishEngulfing(...args),
                isBullishFractal          : (...args) => this.tradeEngine.isBullishFractal(...args),
                isBearishFractal          : (...args) => this.tradeEngine.isBearishFractal(...args),
                latestCandlesSameDirection: (...args) => this.tradeEngine.latestCandlesSameDirection(...args),
                latestTicksSameDirection  : (...args) => this.tradeEngine.latestTicksSameDirection(...args),
                tickDirection             : (...args) => this.tradeEngine.tickDirection(...args),
            };
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/PatternsInterface.js
