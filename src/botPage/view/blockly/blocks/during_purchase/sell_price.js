import { translate } from '../../../../../common/i18n';
import { insideDuringPurchase } from '../../relationChecker';
import theme from '../../theme';

Blockly.Blocks.sell_price = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Sell profit/loss'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the profit for sell at market.'));
    },
    onchange: function onchange(ev) {
        insideDuringPurchase(this, ev, translate('Sell profit/loss'));
    },
};
Blockly.JavaScript.sell_price = () => {
    const code = 'Bot.getSellPrice()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/during_purchase/sell_price.js
