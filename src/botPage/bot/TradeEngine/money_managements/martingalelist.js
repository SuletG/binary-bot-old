export default Engine =>
    class MartingaleList extends Engine {
        moneyManagementParams = {
            stake      : 0.35,
            initial    : 0.35,
            steps      : 0,
            factorsteps: -1,
            factors    : [1, 2, 3, 4],
            maxsteps   : 12,
            startafter : 0,
            reset      : true,
        };
        martingaleListAfterPurchase(result) {
            if (result === 'win') {
                this.martingaleListReset();
            } else {
                this.moneyManagementParams.steps++;
                this.moneyManagementParams.factorsteps++;
                if (
                    this.moneyManagementParams.steps >= this.moneyManagementParams.startafter + 1 &&
                    this.moneyManagementParams.steps <= this.moneyManagementParams.maxsteps
                ) {
                    this.moneyManagementParams.factorsteps =
                        this.moneyManagementParams.factorsteps === this.moneyManagementParams.factors.length
                            ? 0
                            : this.moneyManagementParams.factorsteps;
                    this.moneyManagementParams.stake =
                        this.moneyManagementParams.stake *
                        this.moneyManagementParams.factors[this.moneyManagementParams.factorsteps];
                } else if (
                    this.moneyManagementParams.steps > this.moneyManagementParams.maxsteps &&
                    this.moneyManagementParams.reset
                ) {
                    this.martingaleListReset();
                }
            }
        }

        martingaleListStake = () => this.moneyManagementParams.stake;

        martingaleListTradeDefinitions(args) {
            this.moneyManagementParams = args;
            this.moneyManagementParams.stake = args.initial;
            this.martingaleListReset();
        }

        martingaleListReset() {
            this.moneyManagementParams.steps = 0;
            this.moneyManagementParams.factorsteps = -1;
            this.moneyManagementParams.factors = this.moneyManagementParams.factors.map(a => Number(a));
            this.moneyManagementParams.stake = this.moneyManagementParams.initial;
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/martingalelist.js
