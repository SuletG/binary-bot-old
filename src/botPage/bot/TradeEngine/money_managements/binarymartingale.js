export default Engine =>
    class Martingale extends Engine {
        moneyManagementParams = {
            factor       : 2.2,
            steps        : 0,
            firstWin     : false,
            firstLoss    : false,
            useCumulative: false,
            losses       : 0,
        };
        binarymartingaleAfterPurchase(result) {
            if (result === 'win') {
                if (!this.moneyManagementParams.firstWin) {
                    this.moneyManagementParams.firstWin = true;
                }
                if (this.moneyManagementParams.stake !== this.moneyManagementParams.initial) {
                    this.moneyManagementParams.stake = this.moneyManagementParams.initial;
                    this.moneyManagementParams.firstWin = false;
                    this.moneyManagementParams.firstLoss = false;
                    this.moneyManagementParams.losses = 0;
                }
                if (!this.moneyManagementParams.useCumulative) {
                    if (this.moneyManagementParams.firstWin && this.moneyManagementParams.firstLoss) {
                        this.moneyManagementParams.stake =
                            this.moneyManagementParams.stake * this.moneyManagementParams.factor;
                    }
                } else if (this.moneyManagementParams.firstWin && this.moneyManagementParams.firstLoss) {
                    this.moneyManagementParams.stake = Math.abs(this.moneyManagementParams.losses) * 1.125;
                }
            } else {
                this.moneyManagementParams.losses += this.moneyManagementParams.stake;
                if (!this.moneyManagementParams.firstLoss) {
                    this.moneyManagementParams.firstLoss = true;
                }
                if (this.moneyManagementParams.firstWin) {
                    this.moneyManagementParams.stake = this.moneyManagementParams.initial;
                    this.moneyManagementParams.firstWin = false;
                }
                if (!this.moneyManagementParams.useCumulative) {
                    if (this.moneyManagementParams.firstWin && this.moneyManagementParams.firstLoss) {
                        this.moneyManagementParams.stake =
                            this.moneyManagementParams.stake * this.moneyManagementParams.factor;
                    }
                }
            }
        }

        binarymartingaleStake = () => this.moneyManagementParams.stake;

        binarymartingaleTradeDefinitions(args) {
            this.moneyManagementParams = args;
            this.moneyManagementParams.stake = args.initial;
            this.binarymartingaleReset();
        }

        binarymartingaleReset() {
            this.moneyManagementParams.firstWin = false;
            this.moneyManagementParams.firstLoss = false;
            this.moneyManagementParams.losses = false;
            this.moneyManagementParams.stake = this.moneyManagementParams.initial;
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/binarymartingale.js
