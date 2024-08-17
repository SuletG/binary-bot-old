import React from 'react';
import { translate } from '../../../common/i18n';
import { iframe as iframeStyle } from '../style';
import Dialog from './Dialog';

const chartWidth = 800;
const chartHeight = 500;

function TradingViewComponent() {
    return <iframe id="charty" style={iframeStyle} src="https://charts.deriv.com/" />;
}

export default class TradingView extends Dialog {
    constructor() {
        super('trading-view-dialog', translate('Trading View'), <TradingViewComponent />, {
            width : chartWidth,
            height: chartHeight,
        });
    }
}

// WEBPACK FOOTER //
// ./src/botPage/view/Dialogs/TradingView.js
