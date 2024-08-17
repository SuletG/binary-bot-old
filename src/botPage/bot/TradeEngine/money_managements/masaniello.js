import { notify } from '../../broadcast';
import { translate } from '../../../../common/i18n';

export default Engine =>
    class Masaniello extends Engine {
        moneyManagementParams = {
            initialBalance: 100,
            targetBalance : 100,
            losses        : 0,
            stake         : 0,
            winnings      : 0,
            winrate       : 0,
            wins          : 0,
            trades        : 0,
            maxTrades     : 30,
            table         : [],
            payout        : 0.86,
        };
        masanielloAfterPurchase = details => {
            this.moneyManagementParams.initialBalance += details[3];
            notify('trace', `${translate(`Actual balance ${this.moneyManagementParams.initialBalance.toFixed(2)}`)}`);
            this.moneyManagementParams.trades++;
            if (details[2] > 0) {
                this.moneyManagementParams.winnings++;
            } else {
                this.moneyManagementParams.losses++;
            }
            if (this.moneyManagementParams.initialBalance >= this.moneyManagementParams.targetBalance) {
                notify('trace', `${translate('Take balance reached, stopping the system')}`);
            } else if (this.moneyManagementParams.trades >= this.moneyManagementParams.maxTrades) {
                notify('trace', `${translate('Max number of trades reached')}`);
            }
            return (
                this.moneyManagementParams.initialBalance < this.moneyManagementParams.targetBalance &&
                this.moneyManagementParams.trades < this.moneyManagementParams.maxTrades
            );
        };

        masanielloStake = () => {
            const { payout, winnings, losses, table, initialBalance } = this.moneyManagementParams;
            const stake =
                initialBalance *
                (1 -
                    (payout * table[winnings + 2 - 1][winnings + losses + 2 - 1]) /
                        (table[winnings + 1 - 1][winnings + losses + 2 - 1] +
                            (payout - 1) * table[winnings + 2 - 1][winnings + losses + 2 - 1]));
            return (
                (payout * table[winnings + 2 - 1][winnings + losses + 2 - 1]) /
                (table[winnings + 1 - 1][winnings + losses + 2 - 1] +
                    (payout - 1) * table[winnings + 2 - 1][winnings + losses + 2 - 1])
            );
        };

        masanielloTradeDefinitions(args) {
            this.moneyManagementParams = args;
            this.masanielloReset();
            notify(
                'trace',
                `${translate(`Masaniello target balance is ${this.moneyManagementParams.targetBalance.toFixed(2)}`)}`
            );
        }

        masanielloReset() {
            this.moneyManagementParams.losses = 0;
            this.moneyManagementParams.winnings = 0;
            this.moneyManagementParams.wins = Math.floor(
                (this.moneyManagementParams.maxTrades * this.moneyManagementParams.winrate) / 100
            );
            this.moneyManagementParams.trades = this.moneyManagementParams.maxTrades;
            this.moneyManagementParams.table = this.generateTable();
            this.moneyManagementParams.targetBalance = this.getTargetBalance();
        }

        getTargetBalance = () => {
            const { initialBalance, table } = this.moneyManagementParams;
            return initialBalance + table[0][0] * 10;
        };

        generateTable = () => {
            const table = [];
            const { payout, wins, stake } = this.moneyManagementParams;
            for (let i = 1; i <= wins + 1; i++) {
                for (let j = 1; j <= this.moneyManagementParams.trades + 1; j++) {
                    if (i === 1) {
                        if (j === 1) {
                            table.push([]);
                        }
                        const child = table.slice(-1)[0];
                        child.unshift(stake);
                    } else {
                        if (j === 1) {
                            table.unshift([]);
                        }
                        const child = table.slice(-i)[0];
                        const beforeChild = table.slice(-(i - 1))[0];
                        child.unshift(
                            j === 1
                                ? Math.pow(payout, i - 1)
                                : (payout * child.slice(-(j - 1))[0] * beforeChild.slice(-j)[0]) /
                                      (child.slice(-(j - 1))[0] + (payout - 1) * beforeChild.slice(-j)[0])
                        );
                    }
                }
                this.moneyManagementParams.trades--;
            }
            return table;
        };
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/masaniello.js
