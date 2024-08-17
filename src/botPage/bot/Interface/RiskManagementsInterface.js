export default Interface =>
    class extends Interface {
        getRiskManagementsInterface() {
            return {
                riskAfterPurchase   : profit => this.tradeEngine.riskAfterPurchase(profit),
                riskTradeDefinitions: (...args) => this.tradeEngine.riskTradeDefinitions(...args),
            };
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/RiskManagementsInterface.js
