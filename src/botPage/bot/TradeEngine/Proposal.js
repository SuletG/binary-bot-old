import { translate } from '../../../common/i18n';
import { tradeOptionToProposal, doUntilDone } from '../tools';
import { proposalsReady, clearProposals } from './state/actions';
import { TrackJSError } from '../../view/logger';

export default Engine =>
    class Proposal extends Engine {
        makeProposals(tradeOption) {
            if (!this.isNewTradeOption(tradeOption)) {
                return;
            }
            // Generate a purchase reference when trade options are different from previous trade options.
            // This will ensure the bot doesn't mistakenly purchase the wrong proposal.
            this.regeneratePurchaseReference();
            this.tradeOption = tradeOption;
            this.proposalTemplates = tradeOptionToProposal(tradeOption, this.getPurchaseReference());
            this.renewProposalsOnPurchase();
        }

        selectProposal(contractType) {
            // console.log(this.dataVirtual, this.data);
            const { proposals } =
                this.virtualSettings.active && this.virtualSettings.valid && this.virtualSettings.ongoing
                    ? this.dataVirtual
                    : this.data;
            if (proposals.length === 0) {
                throw Error(translate('Proposals are not ready'));
            }

            const toBuy = proposals.find(proposal => {
                if (
                    proposal.contractType === contractType &&
                    proposal.purchaseReference === this.getPurchaseReference()
                ) {
                    // Below happens when a user has had one of the proposals return
                    // with a ContractBuyValidationError. We allow the logic to continue
                    // to here cause the opposite proposal may still be valid. Only once
                    // they attempt to purchase the errored proposal we will intervene.
                    if (proposal.error) {
                        const { error } = proposal.error.error;
                        const { code, message } = error;
                        throw new TrackJSError(code, message, error);
                    }

                    return proposal;
                }

                return false;
            });

            if (!toBuy) {
                throw new TrackJSError(
                    'CustomInvalidProposal',
                    translate('Selected proposal does not exist'),
                    this.virtualSettings.active && this.virtualSettings.valid && this.virtualSettings.ongoing
                        ? this.dataVirtual.proposals
                        : this.data.proposals
                );
            }
            return {
                proposal: toBuy,
                currency: this.tradeOption.currency,
            };
        }
        renewProposalsOnPurchase() {
            this.unsubscribeProposals().then(() => this.requestProposals());
        }
        clearProposals() {
            this.data.proposals = [];
            this.store.dispatch(clearProposals());
        }
        clearProposalsVirtual() {
            this.dataVirtual.proposals = [];
        }
        requestProposals() {
            Promise.all(
                this.proposalTemplates.map(proposal => {
                    // const api = this.virtualSettings.active && this.virtualSettings.valid && this.virtualSettings.ongoing ? this.virtualApi : this.api;
                    if (this.virtualSettings.active && this.virtualSettings.valid) {
                        this.virtualApi.subscribeToPriceForContractProposal(proposal).catch(error => {
                            if (error && error.name === 'ContractBuyValidationError') {
                                this.dataVirtual.proposals.push({
                                    ...error.error.echo_req,
                                    ...error.error.echo_req.passthrough,
                                    error,
                                });
                                return null;
                            }
                            throw error;
                        });
                    }
                    return this.api.subscribeToPriceForContractProposal(proposal).catch(error => {
                        if (error && error.name === 'ContractBuyValidationError') {
                            this.data.proposals.push({
                                ...error.error.echo_req,
                                ...error.error.echo_req.passthrough,
                                error,
                            });
                            return null;
                        }
                        throw error;
                    });
                })
            ).catch(e => this.$scope.observer.emit('Error', e));
        }
        observeProposals() {
            this.listen('proposal', response => {
                const { passthrough, proposal } = response;
                if (
                    this.data.proposals.findIndex(p => p.id === proposal.id) === -1 &&
                    !this.data.forgetProposalIds.includes(proposal.id)
                ) {
                    // Add proposals based on the ID returned by the API.
                    this.data.proposals.push({ ...proposal, ...passthrough });
                    this.checkProposalReady();
                }
            });
            this.listenVirtual('proposal', response => {
                const { passthrough, proposal } = response;
                if (
                    this.dataVirtual.proposals.findIndex(p => p.id === proposal.id) === -1 &&
                    !this.dataVirtual.forgetProposalIds.includes(proposal.id)
                ) {
                    // Add proposals based on the ID returned by the API.
                    this.dataVirtual.proposals.push({ ...proposal, ...passthrough });
                    this.checkProposalReady();
                }
            });
        }
        unsubscribeProposals() {
            const { proposals: prop } = this.dataVirtual;
            let removeForgetProposalById = forgetProposalId => {
                this.dataVirtual.forgetProposalIds = this.dataVirtual.forgetProposalIds.filter(
                    id => id !== forgetProposalId
                );
            };

            this.clearProposalsVirtual();

            Promise.all(
                prop.map(proposal => {
                    if (!this.dataVirtual.forgetProposalIds.includes(proposal.id)) {
                        this.dataVirtual.forgetProposalIds.push(proposal.id);
                    }

                    if (proposal.error) {
                        removeForgetProposalById(proposal.id);
                        return Promise.resolve();
                    }
                    return doUntilDone(() => this.virtualApi.unsubscribeByID(proposal.id)).then(() =>
                        removeForgetProposalById(proposal.id)
                    );
                })
            );

            const { proposals } = this.data;
            removeForgetProposalById = forgetProposalId => {
                this.data.forgetProposalIds = this.data.forgetProposalIds.filter(id => id !== forgetProposalId);
            };

            this.clearProposals();

            return Promise.all(
                proposals.map(proposal => {
                    if (!this.data.forgetProposalIds.includes(proposal.id)) {
                        this.data.forgetProposalIds.push(proposal.id);
                    }

                    if (proposal.error) {
                        removeForgetProposalById(proposal.id);
                        return Promise.resolve();
                    }
                    return doUntilDone(() => this.api.unsubscribeByID(proposal.id)).then(() =>
                        removeForgetProposalById(proposal.id)
                    );
                })
            );
        }
        async checkProposalReady() {
            const { proposals } =
                this.virtualSettings.active && this.virtualSettings.valid && this.virtualSettings.ongoing
                    ? this.dataVirtual
                    : this.data;
            if (proposals.length > 0) {
                const hasEqualProposals = this.proposalTemplates.every(
                    template =>
                        proposals.findIndex(
                            proposal =>
                                proposal.purchaseReference === template.passthrough.purchaseReference &&
                                proposal.contractType === template.contract_type
                        ) !== -1
                );

                if (hasEqualProposals) {
                    // await Promise.all([
                    //     () => this.startVirtual,
                    //     () => this.startPromise,
                    // ]);
                    // await this.startPromise;
                    // this.store.dispatch(proposalsReady());
                    this.startPromise.then(() => this.store.dispatch(proposalsReady()));
                }
            }
        }
        isNewTradeOption(tradeOption) {
            if (!this.tradeOption) {
                this.tradeOption = tradeOption;
                return true;
            }

            // Compare incoming "tradeOption" argument with "this.tradeOption", if any
            // of the values is different, this is a new tradeOption and new proposals
            // should be generated.
            return [
                'amount',
                'barrierOffset',
                'basis',
                'duration',
                'duration_unit',
                'prediction',
                'secondBarrierOffset',
                'symbol',
            ].some(value => this.tradeOption[value] !== tradeOption[value]);
        }
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/Proposal.js
