// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#pbvgpo
import { insideBeforePurchase } from '../../relationChecker';
import { translate } from '../../../../../common/i18n';
import { getPurchaseChoices } from '../shared';
import theme from '../../theme';

Blockly.Blocks.ask_price = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Ask Price'))
            .appendField(new Blockly.FieldDropdown(() => getPurchaseChoices()), 'PURCHASE_LIST');
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Ask Price for selected proposal'));
    },
    onchange: function onchange(ev) {
        insideBeforePurchase(this, ev, 'Before');
    },
};
Blockly.JavaScript.ask_price = block => {
    const purchaseList = block.getFieldValue('PURCHASE_LIST');
    const code = `Bot.getAskPrice('${purchaseList}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/before_purchase/ask_price.js
