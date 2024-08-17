export default Engine =>
    class StakeList extends Engine {
        moneyManagementParams = {
            stake      : 0.35,
            factorsteps: -1,
            factors    : [1, 2, 3, 4],
        };
        stakeListAfterPurchase(result) {
            if (result === 'win') {
                this.stakeListReset();
            } else {
                let { factorsteps, factors, stake } = this.moneyManagementParams;
                factorsteps++;
                factorsteps = factorsteps === factors.length ? 0 : factorsteps;
                stake = factors[factorsteps];
                this.moneyManagementParams = { ...this.moneyManagementParams, stake, factors, factorsteps };
            }
        }

        stakeListStake = () => this.moneyManagementParams.stake;

        stakeListTradeDefinitions(args) {
            this.moneyManagementParams = args;
            this.moneyManagementParams.factors = args.factors.map(a => Number(a));
            [this.moneyManagementParams.stake] = args.factors;
            this.stakeListReset();
        }

        stakeListReset() {
            this.moneyManagementParams.factorsteps = 0;
            [this.moneyManagementParams.stake] = this.moneyManagementParams.factors;
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/money_managements/stakelist.js
