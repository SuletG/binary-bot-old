export default Engine =>
    class OscarsGrind extends Engine {
        moneyManagementParams = {
            losses : 0,
            wager  : 0.35,
            initial: 0.35,
        };

        oscarsgrindAfterPurchase = details => {
            this.moneyManagementParams.losses -= this.moneyManagementParams.stake;
            if (details[3] > 0) {
                this.moneyManagementParams.losses += details[2];
                if (this.moneyManagementParams.losses >= 0) {
                    this.moneyManagementParams.stake = this.moneyManagementParams.initial;
                    this.moneyManagementParams.losses = 0;
                } else {
                    this.moneyManagementParams.stake += this.moneyManagementParams.wager;
                }
            }
        };

        oscarsgrindStake = () => this.moneyManagementParams.stake;

        oscarsgrindTradeDefinitions = ({ wager }) => {
            this.moneyManagementParams.initial = wager;
            this.moneyManagementParams.wager = this.moneyManagementParams.initial;
            this.moneyManagementParams.stake = this.moneyManagementParams.initial;
            this.oscarsgrindReset();
        };

        oscarsgrindReset = () => {
            this.moneyManagementParams.losses = 0;
            this.moneyManagementParams.wager = this.moneyManagementParams.initial;
        };
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/oscarsgrind.js
