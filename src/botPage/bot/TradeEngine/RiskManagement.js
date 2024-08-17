import { notify } from '../broadcast';
import { translate } from '../../../common/i18n';

export default Engine =>
    class RiskManagement extends Engine {
        riskManagementParams = {
            balance   : 0,
            takeprofit: 3,
            stoploss  : 50,
            maxsteps  : 12,
            steps     : 0,
        };
        riskAfterPurchase(profit) {
            this.riskManagementParams.balance += profit;
            let valid = true;
            if (profit < 0) {
                this.riskManagementParams.steps++;
            } else {
                this.riskManagementParams.steps = 0;
            }
            const takeProfit = this.riskManagementParams.balance >= this.riskManagementParams.takeprofit;
            const stopLoss = this.riskManagementParams.balance <= Math.abs(this.riskManagementParams.stoploss) * -1;
            const maxSteps = this.riskManagementParams.steps >= this.riskManagementParams.maxsteps;
            if (takeProfit || stopLoss || maxSteps) {
                valid = false;
                this.toStop = true;
            }
            if (takeProfit) {
                notify('trace', `${translate('Take Profit Reached, stopping the system')}`);
            } else if (stopLoss) {
                notify('trace', `${translate('Stop Loss Reached, stopping the system')}`);
            } else if (maxSteps) {
                notify('trace', `${translate('Max Losing Trades reached, stopping the system')}`);
            }
            return valid;
        }

        riskTradeDefinitions(args) {
            this.riskManagementParams = args;
            this.riskReset();
        }

        riskReset() {
            this.riskManagementParams.steps = 0;
            this.riskManagementParams.balance = 0;
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/RiskManagement.js
