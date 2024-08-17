// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#pbvgpo
import { insideBeforePurchase } from '../../relationChecker';
import { translate } from '../../../../../common/i18n';
import { getPurchaseChoices } from '../shared';
import theme from '../../theme';

Blockly.Blocks.payout = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Payout'))
            .appendField(new Blockly.FieldDropdown(() => getPurchaseChoices()), 'PURCHASE_LIST');
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Payout for selected proposal'));
    },
    onchange: function onchange(ev) {
        insideBeforePurchase(this, ev, 'Payout');
    },
};
Blockly.JavaScript.payout = block => {
    const purchaseList = block.getFieldValue('PURCHASE_LIST');
    const code = `Bot.getPayout('${purchaseList}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/before_purchase/payout.js
