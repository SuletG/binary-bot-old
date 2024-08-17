import { notify } from '../broadcast';
import { translate } from '../../../common/i18n';
import { observer as globalObserver } from '../../../common/utils/observer';

export default Interface =>
    class extends Interface {
        reportStats = {
            totalProfit   : 0,
            highestBalance: 0,
            lowestBalance : 0,
            highestProfit : 0,
            lowestProfit  : 0,
            startTime     : 0,
            actualTime    : 0,
            winningStreak : 0,
            losingStreak  : 0,
            runs          : 0,
            winRate       : 0,
            winnings      : 0,
            losses        : 0,
        };
        // eslint-disable-next-line class-methods-use-this
        notifyTelegram(accessToken, chatId, text) {
            const url = `https://api.telegram.org/bot${accessToken}/sendMessage`;
            const onError = () => notify('warn', translate('The Telegram notification could not be sent'));

            fetch(url, {
                method : 'POST',
                mode   : 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        onError();
                    }
                })
                .catch(onError);
        }

        getMiscInterface() {
            return {
                notify        : args => globalObserver.emit('Notify', args),
                notifyTelegram: this.notifyTelegram,
                getTotalRuns  : () => this.tradeEngine.getTotalRuns(),
                getBalance    : type => this.tradeEngine.getBalance(type),
                getTotalProfit: toString =>
                    this.tradeEngine.getTotalProfit(toString, this.tradeEngine.tradeOptions.currency),
                report: profit => {
                    this.reportStats.totalProfit = Number((this.reportStats.totalProfit + profit).toFixed(2));
                    this.reportStats.runs++;
                    if (profit < 0) {
                        this.reportStats.totalLosses++;
                    } else {
                        this.reportStats.totalWins++;
                    }
                    this.reportStats.lowestBalance = Math.min(
                        this.reportStats.lowestBalance,
                        this.reportStats.totalProfit
                    ).toFixed(2);
                    this.reportStats.highestBalance = Math.max(
                        this.reportStats.highestBalance,
                        this.reportStats.totalProfit
                    ).toFixed(2);
                    this.reportStats.losses = profit < 0 ? this.reportStats.losses + 1 : 0;
                    this.reportStats.winnings = profit > 0 ? this.reportStats.winnings + 1 : 0;
                    this.reportStats.winRate =
                        this.reportStats.totalWins > 0
                            ? Number(((this.reportStats.totalWins * 100) / this.reportStats.runs).toFixed(2))
                            : 0;
                    this.reportStats.losingStreak = Math.max(this.reportStats.losingStreak, this.reportStats.losses);
                    this.reportStats.winningStreak = Math.max(
                        this.reportStats.winningStreak,
                        this.reportStats.winnings
                    );
                    this.reportStats.lowestProfit = Math.min(this.reportStats.lowestProfit, profit);
                    this.reportStats.highestProfit = Math.max(this.reportStats.highestProfit, profit);
                    this.reportStats.startTime =
                        this.reportStats.startTime === 0 ? Math.round(Date.now() / 1000) : this.reportStats.startTime;
                    let message = `${translate('Total Profit')}: ${this.reportStats.totalProfit} | ${translate(
                        'Highest Balance'
                    )}: ${this.reportStats.highestBalance} | ${translate('Lowest Balance')}: ${
                        this.reportStats.lowestBalance
                    } | ${translate('Highest Profit')}: ${this.reportStats.highestProfit} | ${translate(
                        'Lowest Profit'
                    )}: ${this.reportStats.lowestProfit}`;
                    if (this.reportStats.totalProfit > 0) {
                        globalObserver.emit('Notify', {
                            className: 'success',
                            message,
                            sound    : 'silent',
                        });
                    } else {
                        globalObserver.emit('Notify', {
                            className: 'error',
                            message,
                            sound    : 'silent',
                        });
                    }
                    message = `${translate('Winning Steak')}: ${this.reportStats.winningStreak} | ${translate(
                        'Losing Streak'
                    )}: ${this.reportStats.losingStreak} | ${translate('Runs')}: ${this.reportStats.runs} | ${translate(
                        'Win Rate'
                    )}: ${this.reportStats.winRate} | ${translate('Time')}: ${Math.floor((Date.now() / 1000) % 60) -
                        Math.floor(this.reportStats.startTime % 60)}`;
                    globalObserver.emit('Notify', {
                        className: 'info',
                        message,
                        sound    : 'silent',
                    });
                },
            };
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/MiscInterface.js
