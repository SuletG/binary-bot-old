// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#n3drko
import { translate } from '../../../../../common/i18n';
import { disable } from '../../utils';
import theme from '../../theme';

Blockly.Blocks.direction = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Tick Direction'));
        this.setOutput(true, 'String');
        this.setColour(theme.subBlockColor);
        this.setTooltip(
            translate(
                'Returns the tick direction received by a before purchase block, its value could be \'up\' if the tick is more than before, \'down\' if less than before and empty (\'\') if the tick is equal to the previous tick'
            )
        );
    },
    onchange: function onchange() {
        disable(this, translate('Direction block is deprecated, please use the check direction block instead'));
    },
};

Blockly.JavaScript.direction = () => '';

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/ticks/direction.js
