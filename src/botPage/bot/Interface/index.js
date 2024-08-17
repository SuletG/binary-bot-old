import TradeEngine from '../TradeEngine';
import { noop, createDetails, createActualDetails } from '../tools';
import TicksInterface from './TicksInterface';
import ToolsInterface from './ToolsInterface';

/**
 * Bot - Bot Module
 * @namespace Bot
 */
// ...this.getDigitsInterface(),
export default class Interface extends ToolsInterface(TicksInterface(class {})) {
    constructor($scope) {
        super();
        this.tradeEngine = new TradeEngine($scope);
        this.api = $scope.api;
        this.virtualApi = $scope.virtualApi;
        this.observer = $scope.observer;
        this.$scope = $scope;
    }
    getInterface(name = 'Global') {
        if (name === 'Bot') {
            return {
                ...this.getToolsInterface(),
                ...this.getBotInterface(),
            };
        }
        return {
            watch  : (...args) => this.tradeEngine.watch(...args),
            sleep  : (...args) => this.sleep(...args),
            alert  : (...args) => alert(...args), // eslint-disable-line no-alert
            prompt : (...args) => prompt(...args), // eslint-disable-line no-alert
            console: {
                log(...args) {
                    // eslint-disable-next-line no-console
                    // console.log(new Date().toLocaleTimeString(), ...args);
                },
            },
        };
    }
    getBotInterface() {
        const getDetail = (i, pipSize) => createDetails(this.tradeEngine.data.contract, pipSize)[i];
        const getDetailVirtual = (i, pipSize) => createDetails(this.tradeEngine.dataVirtual.contract, pipSize)[i];
        const getActualDetail = (i, pipSize) => {
            const contract =
                this.tradeEngine.virtualSettings.active &&
                this.tradeEngine.virtualSettings.valid &&
                this.tradeEngine.virtualSettings.ongoing
                    ? this.tradeEngine.dataVirtual.contract
                    : this.tradeEngine.data.contract;
            const details = createActualDetails(contract, pipSize);
            return details[i];
        };

        return {
            init                : (...args) => this.tradeEngine.init(...args),
            start               : (...args) => this.tradeEngine.start(...args),
            stop                : (...args) => this.tradeEngine.stop(...args),
            purchase            : (...args) => this.tradeEngine.purchase(...args),
            getCopyTradingTokens: (...args) => this.tradeEngine.getCopyTradingTokens(...args),
            getPurchaseReference: () => this.tradeEngine.getPurchaseReference(),
            getAskPrice         : contractType => Number(this.getProposal(contractType).ask_price),
            getPayout           : contractType => Number(this.getProposal(contractType).payout),
            isSellAvailable     : () => this.tradeEngine.isSellAtMarketAvailable(),
            sellAtMarket        : () => this.tradeEngine.sellAtMarket(),
            getSellPrice        : () => this.getSellPrice(),
            isResult            : result => getDetail(10) === result,
            readActualDetails   : i => getActualDetail(i - 1, this.tradeEngine.getPipSize()),
            readDetails         : i => getDetail(i - 1, this.tradeEngine.getPipSize()),
            roundDecimals       : (value, decimals) => {
                const v = value.toString();
                const parts = v.split('.');
                if (parts.length > 1) {
                    return Number(`${v.split('.')[0]}.${v.split('.')[1].slice(0, decimals)}`);
                }
                return Number(v);
            },
            readAllDetails       : () => createDetails(this.tradeEngine.data.contract, this.tradeEngine.getPipSize()),
            setVirtualOngoing    : i => (this.tradeEngine.virtualSettings.ongoing = i),
            stopTheBot           : () => (this.tradeEngine.toStop = true),
            isResultVirtual      : result => getDetailVirtual(10) === result,
            readDetailsVirtual   : i => getDetailVirtual(i - 1, this.tradeEngine.getPipSize()),
            readAllDetailsVirtual: () =>
                createDetails(this.tradeEngine.dataVirtual.contract, this.tradeEngine.getPipSize()),
            isVirtualValid   : () => this.tradeEngine.virtualSettings.valid,
            getAccountEmail  : () => this.auth.email,
            getAccountName   : () => this.auth.fullname,
            getAccountLoginid: () => this.auth.loginid,
            getAccountType   : () => (this.auth.is_virtual === 1 ? 'Virtual' : 'Real'),
            getTotalWins     : () => {
                const stats = this.tradeEngine.getAccountStat();
                return stats.totalWins;
            },
            getTotalLosses: () => {
                const stats = this.tradeEngine.getAccountStat();
                return stats.totalLosses;
            },
        };
    }
    sleep(arg = 1) {
        return new Promise(
            r =>
                setTimeout(() => {
                    r();
                    setTimeout(() => this.observer.emit('CONTINUE'), 0);
                }, arg * 1000),
            noop
        );
    }
    getProposal(contractType) {
        const found = this.tradeEngine.data.proposals.find(
            proposal =>
                proposal.contractType === contractType &&
                proposal.purchaseReference === this.tradeEngine.getPurchaseReference()
        );
        return (
            found || {
                payout   : 0,
                ask_price: 0,
            }
        );
    }
    getSellPrice() {
        return this.tradeEngine.getSellPrice();
    }
}

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/index.js
