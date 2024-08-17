export default Engine =>
    class Compound extends Engine {
        moneyManagementParams = {
            stake     : 0.35,
            base      : 50,
            percentage: 1,
        };
        compoundAfterPurchase(profit) {
            this.moneyManagementParams.base += profit;
            this.compoundUpdate();
        }

        compoundStake = () => this.moneyManagementParams.stake;

        compoundTradeDefinitions(args) {
            this.moneyManagementParams = args;
            this.compoundUpdate();
        }

        compoundUpdate = () =>
            (this.moneyManagementParams.stake =
                (this.moneyManagementParams.base * this.moneyManagementParams.percentage) / 100);
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/compound.js
