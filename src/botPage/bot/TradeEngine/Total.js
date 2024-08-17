import { translate } from '../../../common/i18n';
import { roundBalance } from '../../common/tools';
import { info, notify } from '../broadcast';
import { createError } from '../../common/error';
import { observer as globalObserver } from '../../../common/utils/observer';

const skeleton = {
    totalProfit       : 0,
    totalWins         : 0,
    totalWinsVirtual  : 0,
    totalLosses       : 0,
    totalLossesVirtual: 0,
    totalStake        : 0,
    totalPayout       : 0,
    totalRuns         : 0,
};

const globalStat = {};

export default Engine =>
    class Total extends Engine {
        constructor() {
            super();
            this.sessionRuns = 0;
            this.sessionProfit = 0;

            globalObserver.register('summary.clear', () => {
                this.sessionRuns = 0;
                this.sessionProfit = 0;

                const { loginid: accountID } = this.accountInfo;
                globalStat[accountID] = { ...skeleton };
            });
        }
        updateTotals(contract) {
            const { sell_price: sellPrice, buy_price: buyPrice, currency } = contract;

            const profit = Number(
                roundBalance({
                    currency,
                    balance: Number(sellPrice) - Number(buyPrice),
                })
            );

            const win = profit > 0;
            const accountStat = this.getAccountStat();
            if (!this.virtualSettings.ongoing || !this.virtualSettings.active || !this.virtualSettings.valid) {
                accountStat.totalWins += win ? 1 : 0;

                accountStat.totalLosses += !win ? 1 : 0;

                this.sessionProfit = roundBalance({
                    currency,
                    balance: Number(this.sessionProfit) + Number(profit),
                });

                accountStat.totalProfit = roundBalance({
                    currency,
                    balance: Number(accountStat.totalProfit) + Number(profit),
                });
                accountStat.totalStake = roundBalance({
                    currency,
                    balance: Number(accountStat.totalStake) + Number(buyPrice),
                });
                accountStat.totalPayout = roundBalance({
                    currency,
                    balance: Number(accountStat.totalPayout) + Number(sellPrice),
                });
            } else {
                accountStat.totalWinsVirtual += win ? 1 : 0;
                accountStat.totalLossesVirtual += !win ? 1 : 0;
            }
            const {
                accountID,
                totalProfit,
                totalWins,
                totalWinsVirtual,
                totalLosses,
                totalLossesVirtual,
                totalStake,
                totalPayout,
            } = Object.assign(
                {
                    accountID: this.accountInfo.loginid,
                },
                accountStat
            );
            // console.log(accountID, totalProfit, totalWins, totalWinsVirtual, totalLosses, totalLossesVirtual, totalStake, totalPayout);
            info({
                accountID,
                totalProfit,
                totalWins,
                totalWinsVirtual,
                totalLosses,
                totalLossesVirtual,
                totalStake,
                totalPayout,
            });

            if (win) {
                notify('success', `${translate('Profit amount')}: ${profit}`);
            } else {
                notify('warn', `${translate('Loss amount')}: ${profit}`);
            }
        }
        updateAndReturnTotalRuns() {
            this.sessionRuns++;
            const accountStat = this.getAccountStat();
            return this.virtualSettings.active && this.virtualSettings.valid && this.virtualSettings.ongoing
                ? accountStat.totalRuns
                : ++accountStat.totalRuns;
        }
        /* eslint-disable class-methods-use-this */
        getTotalRuns() {
            const accountStat = this.getAccountStat();
            return accountStat.totalRuns;
        }
        getTotalProfit(toString, currency) {
            const accountStat = this.getAccountStat();
            return toString && accountStat.totalProfit !== 0
                ? roundBalance({
                    currency,
                    balance: +accountStat.totalProfit,
                })
                : +accountStat.totalProfit;
        }
        /* eslint-enable */
        checkLimits(tradeOption) {
            if (!tradeOption.limitations) {
                return;
            }

            const {
                limitations: { maxLoss, maxTrades },
            } = tradeOption;

            if (maxLoss && maxTrades) {
                if (this.sessionRuns >= maxTrades) {
                    throw createError('CustomLimitsReached', translate('Maximum number of trades reached'));
                }
                if (this.sessionProfit <= -maxLoss) {
                    throw createError('CustomLimitsReached', translate('Maximum loss amount reached'));
                }
            }
        }
        getAccountStat() {
            const { loginid: accountID } = this.accountInfo;

            if (!(accountID in globalStat)) {
                globalStat[accountID] = { ...skeleton };
            }

            return globalStat[accountID];
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/Total.js
