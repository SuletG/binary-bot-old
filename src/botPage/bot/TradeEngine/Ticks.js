import { getLast } from 'binary-utils';
import { translate } from '../../../common/i18n';
import { getDirection } from '../tools';
import { expectPositiveInteger } from '../sanitize';
import * as constants from './state/constants';

let tickListenerKey;

export default Engine =>
    class Ticks extends Engine {
        watchTicks(symbol) {
            if (symbol && this.symbol !== symbol) {
                const { ticksService } = this.$scope;

                ticksService.stopMonitor({
                    symbol,
                    key: tickListenerKey,
                });

                const callback = ticks => {
                    this.checkProposalReady();
                    const lastTick = ticks.slice(-1)[0];
                    const { epoch } = lastTick;
                    this.store.dispatch({
                        type   : constants.NEW_TICK,
                        payload: epoch,
                    });
                };

                const key = ticksService.monitor({
                    symbol,
                    callback,
                });

                this.symbol = symbol;

                tickListenerKey = key;
            }
        }
        getTicks(toString = false) {
            return new Promise(resolve => {
                this.$scope.ticksService
                    .request({
                        symbol: this.symbol,
                        count : this.options.use5000 ? 5000 : 1000,
                    })
                    .then(ticks => {
                        const pipSize = this.getPipSize();
                        const ticksList = ticks.map(o => {
                            if (toString) {
                                return o.quote.toFixed(pipSize);
                            }
                            return o.quote;
                        });

                        resolve(ticksList);
                    });
            });
        }
        getLastTick(raw, toString = false) {
            return new Promise(resolve =>
                this.$scope.ticksService
                    .request({
                        symbol: this.symbol,
                    })
                    .then(ticks => {
                        let lastTick = raw ? getLast(ticks) : getLast(ticks).quote;
                        if (toString && !raw) {
                            lastTick = lastTick.toFixed(this.getPipSize());
                        }
                        resolve(lastTick);
                    })
            );
        }
        checkDirection(dir) {
            return new Promise(resolve =>
                this.$scope.ticksService
                    .request({
                        symbol: this.symbol,
                    })
                    .then(ticks => resolve(getDirection(ticks) === dir))
            );
        }
        getOhlc = async args => {
            const { granularity = this.options.candleInterval || 60, field } = args || {};
            const ohlc = await this.$scope.ticksService.request({
                symbol: this.symbol,
                granularity,
                count : this.options.use5000 ? 5000 : 1000,
            });
            return field ? ohlc.map(o => o[field]) : ohlc;
            // return new Promise(resolve =>
            //     this.$scope.ticksService
            //         .request({ symbol: this.symbol, granularity })
            //         .then(ohlc => {
            //             console.log(ohlc);
            //             return resolve(field ? ohlc.map(o => o[field]) : ohlc)
            //         })
            // );
        };
        getOhlcFromEnd(args) {
            const { index: i = 1 } = args || {};

            const index = expectPositiveInteger(Number(i), translate('Index must be a positive integer'));

            return new Promise(resolve => this.getOhlc(args).then(ohlc => resolve(ohlc.slice(-index)[0])));
        }
        getPipSize() {
            return this.$scope.ticksService.pipSizes[this.symbol];
        }
        getCandleBody(args) {
            const { index: i = 1 } = args || {};
            const index = expectPositiveInteger(Number(i), translate('Index must be a positive integer'));
            return new Promise(resolve =>
                this.getOhlc(args).then(ohlc => {
                    const body = Math.abs(ohlc.slice(-index)[0].close - ohlc.slice(-index)[0].open);
                    resolve(body);
                })
            );
        }
        getCandleRange(args) {
            const { index: i = 1 } = args || {};
            const index = expectPositiveInteger(Number(i), translate('Index must be a positive integer'));
            return new Promise(resolve =>
                this.getOhlc(args).then(ohlc => {
                    const range = ohlc.slice(-index)[0].high - ohlc.slice(-index)[0].low;
                    resolve(range);
                })
            );
        }
        getCandleWick(args) {
            const { index: i = 1 } = args || {};
            const index = expectPositiveInteger(Number(i), translate('Index must be a positive integer'));
            return new Promise(resolve =>
                this.getOhlc(args).then(ohlc => {
                    const body = Math.abs(ohlc.slice(-index)[0].close - ohlc.slice(-index)[0].open);
                    const range = ohlc.slice(-index)[0].high - ohlc.slice(-index)[0].low;
                    resolve(range - body);
                })
            );
        }
        getCandleUpperWick(args) {
            const { index: i = 1 } = args || {};
            const index = expectPositiveInteger(Number(i), translate('Index must be a positive integer'));
            return new Promise(resolve =>
                this.getOhlc(args).then(ohlc => {
                    const upper =
                        ohlc.slice(-index)[0].high - Math.max(ohlc.slice(-index)[0].close, ohlc.slice(-index)[0].open);
                    resolve(upper);
                })
            );
        }
        getCandleLowerWick(args) {
            const { index: i = 1 } = args || {};
            const index = expectPositiveInteger(Number(i), translate('Index must be a positive integer'));
            return new Promise(resolve =>
                this.getOhlc(args).then(ohlc => {
                    const lower =
                        Math.min(ohlc.slice(-index)[0].close, ohlc.slice(-index)[0].open) - ohlc.slice(-index)[0].low;
                    resolve(lower);
                })
            );
        }
        checkCross = args => {
            const { index: i = 1, input1: ip1 = [], input2: ip2 = [], type: t = 'over' } = args || {};
            const index = expectPositiveInteger(Number(i), translate('Index must be a positive integer'));
            return new Promise(resolve => {
                let valid = false;
                if (
                    (ip1.slice(-1 - index)[0] <= ip2.slice(-1 - index)[0] &&
                        ip1.slice(-index)[0] > ip2.slice(-index)[0] &&
                        (t === 'over' || t === 'any')) ||
                    (ip1.slice(-1 - index)[0] >= ip2.slice(-1 - index)[0] &&
                        ip1.slice(-index)[0] < ip2.slice(-index)[0] &&
                        (t === 'under' || t === 'any'))
                ) {
                    valid = true;
                }
                resolve(valid);
            });
        };
        getSupportResistance = async args => {
            const { index: i = 1, source = 'candles', field = 'support', period = 20, granularity = '60' } = args || {};
            const index = expectPositiveInteger(Number(i), translate('Index must be a positive integer'));
            const src =
                source === 'candles'
                    ? await this.getOhlc({
                        field: field === 'support' ? 'low' : 'high',
                        granularity,
                    })
                    : await this.getTicks();
            return Math[field === 'support' ? 'min' : 'max'](...src.slice(-period - index, -index));
        };

        amountOfTicksDirection = async args => {
            const { direction = 'rise', amount = 100 } = args || {};
            const ticks = await this.$scope.ticksService.request({
                symbol: this.symbol,
            });
            const ticksList = ticks.map(o => o.quote).slice(-amount - 1);

            const count = ticksList.reduce(
                (counts, currentValue, index) => {
                    if (index !== ticksList.length - 1) {
                        if (currentValue < ticksList[index + 1]) {
                            counts.increaseCount++;
                        } else if (currentValue > ticksList[index + 1]) {
                            counts.decreaseCount++;
                        }
                    }
                    return counts;
                },
                {
                    increaseCount: 0,
                    decreaseCount: 0,
                }
            );
            return direction === 'rise' ? count.increaseCount : count.decreaseCount;
        };
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/Ticks.js
