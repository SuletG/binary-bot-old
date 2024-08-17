let results = [];
// eslint-disable-next-line import/prefer-default-export
export const CHOP = {
    calculate: input => {
        results = [];
        const { period, low, high, close } = input;
        const log10 = Math.log10(period);
        for (let i = 0; i < 1; i++) {
            const array = [];
            for (let j = 0; j < period; j++) {
                const high1 = high.slice(-i - j - 1)[0];
                const low1 = low.slice(-i - j - 1)[0];
                const close1 = close.slice(-i - j - 2)[0];
                const highLow = high1 - low1;
                const absHighClose = Math.abs(high1 - close1);
                const absLowClose = Math.abs(low1 - close1);
                const element = Math.max(highLow, absHighClose, absLowClose);
                array.unshift(element);
            }
            const sum = array.reduce((a, b) => a + b, 0);
            const max = Math.max(...high.slice(-i - period, -i - 1));
            const min = Math.min(...low.slice(-i - period, -i - 1));
            const chop = (100 * Math.log10(sum / (max - min))) / log10;
            results.push(chop);
        }

        return results.filter(a => a !== null);
    },
};

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/directionalmovement/CHOP.js
