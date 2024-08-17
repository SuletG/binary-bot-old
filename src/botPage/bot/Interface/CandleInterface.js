import { expectCandle, expectCandles } from '../sanitize';

export default Interface =>
    class extends Interface {
        // eslint-disable-next-line class-methods-use-this
        getCandleInterface() {
            return {
                isCandleBlack     : candle => expectCandle(candle) && candle.close < candle.open,
                isNewCandle       : timeframe => Math.floor(new Date().getTime() / 1000) % timeframe < 2,
                isLastTickOfCandle: (t, s) => Math.floor(new Date().getTime() / 1000) % t > t - s,
                candleValues      : (ohlc, field) => expectCandles(ohlc).map(o => o[field]),
                candleField       : (candle, field) => expectCandle(candle)[field],
                secondsToTf       : timeframe => {
                    const left = ((60 * (timeframe / 60) - new Date().getSeconds()) % (60 * (timeframe / 60))) - 3;
                    return left;
                },
            };
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/CandleInterface.js
