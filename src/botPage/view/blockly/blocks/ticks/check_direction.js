import { translate } from '../../../../../common/i18n';
import { mainScope } from '../../relationChecker';
import config from '../../../../common/const';
import theme from '../../theme';

Blockly.Blocks.check_direction = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Direction is'))
            .appendField(new Blockly.FieldDropdown(config.lists.CHECK_DIRECTION), 'CHECK_DIRECTION');
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('True if the direction matches the selection'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Check Direction');
    },
};
Blockly.JavaScript.check_direction = block => {
    const checkWith = block.getFieldValue('CHECK_DIRECTION');
    return [`Bot.checkDirection('${checkWith}')`, Blockly.JavaScript.ORDER_ATOMIC];
};

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/ticks/check_direction.js
