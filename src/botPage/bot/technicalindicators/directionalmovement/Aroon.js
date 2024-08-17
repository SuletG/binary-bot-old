const results = [];

// eslint-disable-next-line import/prefer-default-export
export const Aroon = {
    calculate: input => {
        const { period, low, high } = input;
        for (let i = period; i < low.length; i++) {
            const H = high.slice(i - period, i);
            const L = low.slice(i - period, i);
            const max = Math.max(...H);
            const maxIndex = H.length - H.findIndex(a => a === max);
            const min = Math.min(...L);
            const minIndex = L.length - L.findIndex(a => a === min);
            const upper = (100 * (maxIndex + period)) / period - 100;
            const lower = (100 * (minIndex + period)) / period - 100;
            results[i] = {
                upper,
                lower,
            };
        }
        return results.filter(a => a !== null);
    },
};

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/directionalmovement/Aroon.js
