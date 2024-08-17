export default Engine =>
    class Patterns extends Engine {
        isBullishEngulfing = async ({ granularity, index }) => {
            const ohlc = await this.getOhlc({
                granularity,
            });
            const actual = ohlc.slice(-index)[0];
            const past = ohlc.slice(-index - 1)[0];
            return (
                actual.open < past.close &&
                actual.close > past.open &&
                past.open > past.close &&
                actual.open < actual.close
            );
        };
        isBearishEngulfing = async ({ granularity, index }) => {
            const ohlc = await this.getOhlc({
                granularity,
            });
            const actual = ohlc.slice(-index)[0];
            const past = ohlc.slice(-index - 1)[0];
            return (
                actual.open > past.close &&
                actual.close < past.open &&
                past.open < past.close &&
                actual.open > actual.close
            );
        };
        isHammerPattern = async ({ granularity, index }) => {
            const ohlc = await this.getOhlc({
                granularity,
            });
            const { open, high, low, close } = ohlc.slice(-index)[0];
            const pattern = high - close < (close - open) / 3 && close > open && close - open <= 2 * (open - low);
            return pattern;
        };
        isInvertedHammerPattern = async ({ granularity, index }) => {
            const ohlc = await this.getOhlc({
                granularity,
            });
            const { open, high, low, close } = ohlc.slice(-index)[0];
            const pattern = open - low < (close - open) / 3 && open < close && close - open <= 2 * (high - close);
            return pattern;
        };
        isHangingManPattern = async ({ granularity, index }) => {
            const ohlc = await this.getOhlc({
                granularity,
            });
            const { open, high, low, close } = ohlc.slice(-index)[0];
            const pattern = high - open < (open - close) / 3 && close < open && open - close <= 2 * (close - low);
            return pattern;
        };
        isShootingStarPattern = async ({ granularity, index }) => {
            const ohlc = await this.getOhlc({
                granularity,
            });
            const { open, high, low, close } = ohlc.slice(-index)[0];
            const pattern = open - low < (close - open) / 3 && open < close && close - open <= 2 * (high - close);
            return pattern;
        };
        isBullishFractal = async ({ granularity }) => {
            let high = await this.getOhlc({
                granularity,
                field: 'high',
            });
            high = high.slice(-5).reverse();
            return high[0] < high[2] && high[1] < high[2] && high[3] < high[2] && high[4] < high[2];
        };
        isBearishFractal = async ({ granularity }) => {
            let low = await this.getOhlc({
                granularity,
                field: 'low',
            });
            low = low.slice(-5).reverse();
            return low[0] > low[2] && low[1] > low[2] && low[3] > low[2] && low[4] > low[2];
        };

        latestTicksSameDirection = async ({ amount }) => {
            let ticks = await this.getTicks(true);
            ticks = ticks.slice(-(amount + 1)).reverse();
            let count = 0;
            for (let i = 0; i < ticks.length; i++) {
                const actual = ticks[i];
                const past = ticks[i + 1];
                if (actual > past) {
                    count++;
                } else {
                    count--;
                }
            }
            return count === -amount || count === amount;
        };

        latestCandlesSameDirection = async ({ granularity, amount }) => {
            let ohlc = await this.getOhlc({
                granularity,
            });
            ohlc = ohlc.slice(-amount).reverse();
            let count = 0;
            for (let i = 0; i < ohlc.length; i++) {
                const candle = ohlc[i];
                if (candle.close > candle.open) {
                    count++;
                } else {
                    count--;
                }
            }
            return count === -amount || count === amount;
        };

        tickDirection = async ({ direction, index }) => {
            let ticks = await this.getTicks();
            ticks = ticks.slice(-(index + 2), -index);
            return (direction === 'up' && ticks[0] < ticks[1]) || (direction === 'down' && ticks[0] > ticks[1]);
        };
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/Patterns.js
