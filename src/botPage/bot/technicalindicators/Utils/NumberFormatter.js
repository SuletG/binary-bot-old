import { getConfig } from '../config';

export function format(v) {
    const precision = getConfig('precision');
    if (precision) {
        return parseFloat(v.toPrecision(precision));
    }
    return v;
}

// WEBPACK FOOTER //
// ./src/botPage/bot/technicalindicators/Utils/NumberFormatter.js
