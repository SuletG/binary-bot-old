export default Engine =>
    class ProfitCompound extends Engine {
        moneyManagementParams = {
            stake        : 0.35,
            initial      : 0.35,
            maxSteps     : 5,
            steps        : 0,
            percentage   : 1,
            restartOnLoss: true,
        };
        profitCompoundAfterPurchase(profit) {
            if (profit > 0) {
                this.moneyManagementParams.steps++;
                this.moneyManagementParams.stake += (profit * this.moneyManagementParams.percentage) / 100;
                if (this.moneyManagementParams.steps > this.moneyManagementParams.maxSteps) {
                    this.profitCompoundUpdate();
                }
            } else {
                this.moneyManagementParams.steps = 0;
                if (this.moneyManagementParams.restartOnLoss) {
                    this.moneyManagementParams.stake = this.moneyManagementParams.initial;
                }
            }
        }

        profitCompoundStake = () => this.moneyManagementParams.stake;

        profitCompoundTradeDefinitions(args) {
            this.moneyManagementParams = args;
            this.profitCompoundUpdate();
        }

        profitCompoundUpdate = () => {
            this.moneyManagementParams.steps = 0;
            this.moneyManagementParams.stake = this.moneyManagementParams.initial;
        };
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/profitcompound.js
