// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#u7tjez
import { translate } from '../../../../../common/i18n';
import './purchase';
import './ask_price';
import './payout';
import { configMainBlock, setBlockTextColor } from '../../utils';
import theme from '../../theme';

Blockly.Blocks.before_purchase = {
    init: function init() {
        this.appendDummyInput()
            // .appendField(new Blockly.FieldImage('', 0, 0, 'Before Purchase'))
            .appendField(`${translate('Before Purchase')}                             `, 'TITLE');
        this.appendStatementInput('BEFOREPURCHASE_STACK').setCheck('Purchase');
        this.setColour(theme.blockColor);
        this.setTooltip(translate('Watch the tick stream and purchase the desired contract (Runs on tick update)'));
    },
    onchange: function onchange(ev) {
        if (ev.type === 'create') {
            setBlockTextColor(this);
        }
        configMainBlock(ev, 'before_purchase');
        if (this.getField('TITLE').textElement_) {
            this.getField('TITLE').textElement_.removeAttribute('style');
            Blockly.utils.addClass(this.getField('TITLE').textElement_, 'top-block-title');
        }
        // this.getField('TITLE').textElement_.style.fill = '#f0b90a !important';
    },
};
Blockly.JavaScript.before_purchase = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'BEFOREPURCHASE_STACK');
    const code = `BinaryBotPrivateBeforePurchase = function BinaryBotPrivateBeforePurchase(){
    
${stack}
};
  `;
    return code;
};

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/before_purchase/index.js
