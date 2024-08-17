export default Engine =>
    class Martingale extends Engine {
        moneyManagementParams = {
            stake     : 0.35,
            initial   : 0.35,
            steps     : 0,
            factor    : 2.1,
            maxsteps  : 12,
            startafter: 0,
            reset     : true,
        };
        martingaleAfterPurchase(result) {
            if (result === 'win') {
                this.martingaleReset();
            } else {
                this.moneyManagementParams.steps++;
                if (
                    this.moneyManagementParams.steps >= this.moneyManagementParams.startafter + 1 &&
                    this.moneyManagementParams.steps <= this.moneyManagementParams.maxsteps
                ) {
                    this.moneyManagementParams.stake =
                        this.moneyManagementParams.stake * this.moneyManagementParams.factor;
                } else if (
                    this.moneyManagementParams.steps > this.moneyManagementParams.maxsteps &&
                    this.moneyManagementParams.reset
                ) {
                    this.martingaleReset();
                }
            }
        }

        martingaleStake = () => this.moneyManagementParams.stake;

        martingaleTradeDefinitions(args) {
            this.moneyManagementParams = args;
            this.moneyManagementParams.stake = args.initial;
            this.martingaleReset();
        }

        martingaleReset() {
            this.moneyManagementParams.steps = 0;
            this.moneyManagementParams.stake = this.moneyManagementParams.initial;
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/martingale.js
