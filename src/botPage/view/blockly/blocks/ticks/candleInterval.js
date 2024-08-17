import config from '../../../../common/const';
import { translate } from '../../../../../common/i18n';
import theme from '../../theme';

export default function candleInterval(block) {
    block
        .appendDummyInput()
        .appendField(`${translate('with interval')}:`, 'CANDLEINTERVAL_LIST_BODY')
        .appendField(new Blockly.FieldDropdown(config.candleIntervals), 'CANDLEINTERVAL_LIST');

    block.setInputsInline(true);
    block.setColour(theme.subBlockColor);
    // block.getField('CANDLEINTERVAL_LIST').textElement_.removeAttribute('style');
    // block.getField('CANDLEINTERVAL_LIST').textElement_.style.fill = '#f0b90a !important';
    // Blockly.utils.addClass(block.getField('CANDLEINTERVAL_LIST').textElement_, 'top-block-title');
}

export const getGranularity = block => {
    const granularity = block.getFieldValue('CANDLEINTERVAL_LIST');
    return granularity === 'default' ? 'undefined' : granularity;
};

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/ticks/candleInterval.js
