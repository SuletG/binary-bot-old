import { getLastDigit } from '../tools';

export default Engine =>
    class Digits extends Engine {
        getLastDigit = async () => {
            const lastTick = await this.getLastTick(false, true);
            return getLastDigit(lastTick);
        };
        getLastDigitList = async () => {
            const ticks = await this.getTicks(true);
            return ticks.map(tick => getLastDigit(tick));
        };
        getEvenOddAmount = async args => {
            const digits = await this.getTicks(true).then(ticks =>
                ticks.slice(-args.amount).map(tick => getLastDigit(tick))
            );
            return digits.reduce(
                (a, b) => a + ((b % 2 === 0 && args.type === 'Even') || (b % 2 !== 0 && args.type === 'Odd') ? 1 : 0),
                0
            );
        };
        getDigitsPercentage = async args => {
            const ticks = await this.getTicks(true);
            const digits = ticks.slice(-args.amount).map(tick => getLastDigit(tick));
            const map = digits.reduce(
                (cnt, cur) => ((cnt[cur] = cnt[cur] + 1 || 1), cnt),
                Object.assign(
                    {},
                    ...Array.from(Array(10), (_, i) => ({
                        [i]: 0,
                    }))
                )
            );
            return Number(((map[args.digit] * 100) / args.amount).toFixed(2));
        };
        getMostFrequentDigit = async ({ amount }) => {
            const ticks = await this.getTicks(true);
            const digits = ticks.slice(-amount).map(tick => getLastDigit(tick));
            const map = digits.reduce(
                (cnt, cur) => ((cnt[cur] = cnt[cur] + 1 || 1), cnt),
                Object.assign(
                    {},
                    ...Array.from(Array(10), (_, i) => ({
                        [i]: 0,
                    }))
                )
            );
            const tmp = Object.values(map);
            return tmp.indexOf(Math.max(...tmp));
        };
        getLeastFrequentDigit = async ({ amount }) => {
            const ticks = await this.getTicks(true);
            const digits = ticks.slice(-amount).map(tick => getLastDigit(tick));
            const map = digits.reduce(
                (cnt, cur) => ((cnt[cur] = cnt[cur] + 1 || 1), cnt),
                Object.assign(
                    {},
                    ...Array.from(Array(10), (_, i) => ({
                        [i]: 0,
                    }))
                )
            );
            const tmp = Object.values(map);
            return tmp.indexOf(Math.min(...tmp));
        };
        areTheLastDigitsTheSame = async ({ amount, digit }) => {
            const ticks = await this.getTicks(true);
            const digits = ticks.slice(-amount).map(tick => getLastDigit(tick));
            const isValid = new Set(digits).size === 1 && (digit === 'same' ? true : digits[0] === Number(digit));
            return isValid;
        };
        getDecimals = async () => {
            const lastTick = await this.getLastTick(false, true);
            return lastTick.split('.')[1];
        };
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/Digits.js
