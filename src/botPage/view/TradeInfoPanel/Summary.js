import React, { Component } from 'react';
import { observer as globalObserver } from '../../../common/utils/observer';
import { translate } from '../../../common/i18n';
import * as style from '../style';

export default class Summary extends Component {
    constructor({ accountID }) {
        super();
        this.state = {
            [accountID]: {},
        };
    }
    componentDidMount() {
        globalObserver.register('bot.info', info => {
            const { accountID } = info;
            this.setState({
                [accountID]: { ...this.state[accountID], ...info },
            });
        });
        globalObserver.register('summary.clear', () => {
            const { accountID } = this.props;
            this.setState({
                [accountID]: {},
            });
        });
    }
    render() {
        const { accountID } = this.props;

        const {
            totalRuns,
            totalStake,
            totalPayout,
            totalWins,
            totalWinsVirtual,
            totalLosses,
            totalLossesVirtual,
            totalProfit,
            balance,
        } = accountID in this.state ? this.state[accountID] : {};

        const profitColor = {
            color: totalProfit > 0 ? 'green' : 'red',
        };
        return (
            <table>
                <thead>
                    <tr>
                        <th> {translate('Account')} </th> <th> {translate('No. of runs')} </th>{' '}
                        <th> {translate('Total stake')} </th> <th> {translate('Total payout')} </th>{' '}
                        <th>
                            {' '}
                            {translate('Win')}({translate('virtual')}){' '}
                        </th>{' '}
                        <th>
                            {' '}
                            {translate('Loss')}({translate('virtual')}){' '}
                        </th>{' '}
                        <th> {translate('Total profit/loss')} </th> <th> {translate('Balance')} </th>{' '}
                    </tr>{' '}
                </thead>{' '}
                <tbody>
                    <tr>
                        <td className="accountID"> {accountID} </td> <td className="totalRuns"> {totalRuns} </td>{' '}
                        <td className="totalStake"> {totalStake} </td> <td className="totalPayout"> {totalPayout} </td>{' '}
                        <td style={style.green} className="totalWins">
                            {' '}
                            {totalWins} {totalWinsVirtual > 0 ? `(${totalWinsVirtual})` : ''}{' '}
                        </td>{' '}
                        <td style={style.red} className="totalLosses">
                            {' '}
                            {totalLosses} {totalLossesVirtual > 0 ? `(${totalLossesVirtual})` : ''}{' '}
                        </td>{' '}
                        <td style={profitColor} className="totalProfit">
                            {' '}
                            {totalProfit}{' '}
                        </td>{' '}
                        <td className="balance">
                            {' '}
                            {balance?.includes('UST') ? balance.replace('UST', 'USDT') : balance}{' '}
                        </td>{' '}
                    </tr>{' '}
                </tbody>{' '}
            </table>
        );
    }
}

// WEBPACK FOOTER //
// ./src/botPage/view/TradeInfoPanel/Summary.js
