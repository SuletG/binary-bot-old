export default Interface =>
    class extends Interface {
        getMoneyManagementsInterface() {
            return {
                masanielloAfterPurchase         : result => this.tradeEngine.masanielloAfterPurchase(result),
                masanielloStake                 : () => this.tradeEngine.masanielloStake(),
                masanielloTradeDefinitions      : (...args) => this.tradeEngine.masanielloTradeDefinitions(...args),
                martingaleAfterPurchase         : result => this.tradeEngine.martingaleAfterPurchase(result),
                martingaleStake                 : () => this.tradeEngine.martingaleStake(),
                martingaleTradeDefinitions      : (...args) => this.tradeEngine.martingaleTradeDefinitions(...args),
                martingaleListAfterPurchase     : result => this.tradeEngine.martingaleListAfterPurchase(result),
                martingaleListStake             : () => this.tradeEngine.martingaleListStake(),
                martingaleListTradeDefinitions  : (...args) => this.tradeEngine.martingaleListTradeDefinitions(...args),
                stakeListAfterPurchase          : result => this.tradeEngine.stakeListAfterPurchase(result),
                stakeListStake                  : () => this.tradeEngine.stakeListStake(),
                stakeListTradeDefinitions       : (...args) => this.tradeEngine.stakeListTradeDefinitions(...args),
                compoundAfterPurchase           : result => this.tradeEngine.compoundAfterPurchase(result),
                compoundStake                   : () => this.tradeEngine.compoundStake(),
                compoundTradeDefinitions        : (...args) => this.tradeEngine.compoundTradeDefinitions(...args),
                profitCompoundAfterPurchase     : result => this.tradeEngine.profitCompoundAfterPurchase(result),
                profitCompoundStake             : () => this.tradeEngine.profitCompoundStake(),
                profitCompoundTradeDefinitions  : (...args) => this.tradeEngine.profitCompoundTradeDefinitions(...args),
                oscarsgrindAfterPurchase        : details => this.tradeEngine.oscarsgrindAfterPurchase(details),
                oscarsgrindStake                : () => this.tradeEngine.oscarsgrindStake(),
                oscarsgrindTradeDefinitions     : (...args) => this.tradeEngine.oscarsgrindTradeDefinitions(...args),
                recoverAfterPurchase            : result => this.tradeEngine.recoverAfterPurchase(result),
                recoverStake                    : () => this.tradeEngine.recoverStake(),
                recoverTradeDefinitions         : (...args) => this.tradeEngine.recoverTradeDefinitions(...args),
                equilibriumAfterPurchase        : result => this.tradeEngine.equilibriumAfterPurchase(result),
                equilibriumStake                : () => this.tradeEngine.equilibriumStake(),
                equilibriumTradeDefinitions     : (...args) => this.tradeEngine.equilibriumTradeDefinitions(...args),
                smartmartingaleAfterPurchase    : result => this.tradeEngine.smartmartingaleAfterPurchase(result),
                smartmartingaleStake            : () => this.tradeEngine.smartmartingaleStake(),
                smartmartingaleTradeDefinitions : (...args) => this.tradeEngine.smartmartingaleTradeDefinitions(...args),
                binarymartingaleAfterPurchase   : result => this.tradeEngine.binarymartingaleAfterPurchase(result),
                binarymartingaleStake           : () => this.tradeEngine.binarymartingaleStake(),
                binarymartingaleTradeDefinitions: (...args) =>
                    this.tradeEngine.binarymartingaleTradeDefinitions(...args),
            };
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/MoneyManagementsInterface.js
