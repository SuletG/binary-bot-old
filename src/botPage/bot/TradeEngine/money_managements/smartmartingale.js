export default Engine =>
    class SmartMartingale extends Engine {
        moneyManagementParams = {
            stake     : 0.35,
            initial   : 0.35,
            factor    : 3,
            mainSteps : 0,
            reset     : true,
            startAfter: 0,
            steps     : 100,
            steps1    : 100,
            maxSteps  : 3,
        };
        smartmartingaleAfterPurchase(result) {
            if (result === 'win') {
                this.moneyManagementParams.steps1++;
                this.moneyManagementParams.mainSteps = 0;
                if (
                    this.moneyManagementParams.reset &&
                    this.moneyManagementParams.steps1 >= Number(this.moneyManagementParams.maxSteps)
                ) {
                    this.moneyManagementParams.stake = this.moneyManagementParams.initialStake;
                }
            } else {
                this.moneyManagementParams.steps1 = 0;
                this.moneyManagementParams.mainSteps++;
                if (this.moneyManagementParams.mainSteps > this.moneyManagementParams.startAfter) {
                    this.moneyManagementParams.stake *= this.moneyManagementParams.factor;
                }
            }
        }

        smartmartingaleStake = () => this.moneyManagementParams.stake;

        smartmartingaleTradeDefinitions(args) {
            this.moneyManagementParams = args;
            this.moneyManagementParams.stake = args.initial;
            console.log(this.moneyManagementParams);
            this.smartmartingaleReset();
        }

        smartmartingaleReset() {
            this.moneyManagementParams.steps = 100;
            this.moneyManagementParams.mainSteps = 0;
            this.moneyManagementParams.steps1 = 100;
            this.moneyManagementParams.stake = this.moneyManagementParams.initial;
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/smartmartingale.js
