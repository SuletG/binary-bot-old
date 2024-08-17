/* eslint-disable prefer-destructuring */
export default Engine =>
    class Equilibrium extends Engine {
        moneyManagementParams = {
            factor : 2.2,
            initial: 0,
            losses : 0,
            stake  : 0,
            wins   : 0,
        };

        equilibriumAfterPurchase = result => {
            if (result === 'win') {
                this.moneyManagementParams.wins++;
                if (this.moneyManagementParams.wins > this.moneyManagementParams.losses - 2) {
                    this.equilibriumReset();
                } else {
                    this.moneyManagementParams.stake =
                        this.moneyManagementParams.stake * this.moneyManagementParams.factor;
                }
                if (this.moneyManagementParams.stake > this.moneyManagementParams.initial) {
                    this.moneyManagementParams.stake = this.moneyManagementParams.initial;
                }
            } else {
                this.moneyManagementParams.losses++;
                if (this.moneyManagementParams.wins > this.moneyManagementParams.losses - 2) {
                    this.moneyManagementParams.stake = this.moneyManagementParams.initial;
                } else {
                    this.moneyManagementParams.stake =
                        this.moneyManagementParams.stake * this.moneyManagementParams.factor;
                }
            }
        };

        equilibriumStake = () => this.moneyManagementParams.stake;

        equilibriumTradeDefinitions = args => {
            this.moneyManagementParams = { ...args, stake: args.initial, losses: 0, wins: 0 };
        };

        equilibriumReset = () => {
            this.moneyManagementParams.wins = 0;
            this.moneyManagementParams.losses = 0;
            this.moneyManagementParams.stake = this.moneyManagementParams.initial;
        };
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/equilibrium.js
