// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#qx2zox
import { translate } from '../../../../../common/i18n';
import './sell_at_market';
import './check_sell';
import './sell_price';
import { configMainBlock, setBlockTextColor } from '../../utils';
import theme from '../../theme';

Blockly.Blocks.during_purchase = {
    init: function init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage('', 0, 0, 'S'))
            .appendField(`${translate('Watch Purchase')}                             `, 'TITLE');
        this.appendStatementInput('DURING_PURCHASE_STACK').setCheck('SellAtMarket');
        this.setColour(theme.blockColor);
        this.setTooltip(
            translate('Watch the purchased contract info and sell at market if available (Runs on contract update)')
        );
        this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
    },
    onchange: function onchange(ev) {
        if (ev.type === 'create') {
            setBlockTextColor(this);
        }
        configMainBlock(ev, 'during_purchase');
        this.getField('TITLE').textElement_.removeAttribute('style');
        // this.getField('TITLE').textElement_.style.fill = '#f0b90a !important';
        Blockly.utils.addClass(this.getField('TITLE').textElement_, 'top-block-title');
    },
};
Blockly.JavaScript.during_purchase = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'DURING_PURCHASE_STACK');
    const code = `BinaryBotPrivateDuringPurchase = function BinaryBotPrivateDuringPurchase(){
    ${stack}
  };
  `;
    return code;
};

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/during_purchase/index.js
