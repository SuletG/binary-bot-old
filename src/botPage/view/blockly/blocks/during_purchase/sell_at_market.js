// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#pbvgpo
import { translate } from '../../../../../common/i18n';
import { insideDuringPurchase } from '../../relationChecker';
import theme from '../../theme';

Blockly.Blocks.sell_at_market = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Sell at market'));
        this.setPreviousStatement(true, 'SellAtMarket');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Sell at market.'));
    },
    onchange: function onchange(ev) {
        insideDuringPurchase(this, ev, translate('Sell at market'));
    },
};
Blockly.JavaScript.sell_at_market = () => 'Bot.sellAtMarket();\n';

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/during_purchase/sell_at_market.js
