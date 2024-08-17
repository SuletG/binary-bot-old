/* eslint-disable prefer-destructuring */
export default Engine =>
    class Recover extends Engine {
        moneyManagementParams = {
            initial   : 0,
            maxSteps  : 20,
            profit    : 1,
            startAfter: 0,
            stake     : 0,
            steps     : 0,
            total     : 0,
        };

        recoverAfterPurchase = details => {
            const corePayout = this.actualContract.payout - this.actualContract.buy_price;
            const { profit, maxSteps, startAfter } = this.moneyManagementParams;
            const payout = corePayout / this.moneyManagementParams.stake - (profit > 0 ? profit / 100 : 0);

            if (details[3] < 0) {
                this.moneyManagementParams.total += this.moneyManagementParams.stake;
                this.moneyManagementParams.steps++;
                if (
                    this.moneyManagementParams.steps >= Number(maxSteps) ||
                    this.moneyManagementParams.steps < Number(startAfter)
                ) {
                    this.recoverReset();
                } else {
                    this.moneyManagementParams.stake = Number((this.moneyManagementParams.total / payout).toFixed(2));
                }
            } else {
                this.recoverReset();
            }
        };

        recoverStake = () => this.moneyManagementParams.stake;

        recoverTradeDefinitions = args => {
            this.moneyManagementParams = { ...args, steps: 0, total: 0, stake: args.initial };
        };

        recoverReset = () => {
            this.moneyManagementParams.total = 0;
            this.moneyManagementParams.steps = 0;
            this.moneyManagementParams.stake = this.moneyManagementParams.initial;
        };
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/recover.js
