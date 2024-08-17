// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import { mainScope } from '../../relationChecker';
import { translate } from '../../../../../common/i18n';
import theme from '../../theme';

Blockly.Blocks.tick = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Last Tick'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the tick value received by a before purchase block'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Tick Value');
    },
};
Blockly.JavaScript.tick = () => ['Bot.getLastTick(false, false)', Blockly.JavaScript.ORDER_ATOMIC];

Blockly.Blocks.tick_string = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Last Tick String'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the tick value received by a before purchase block (String)'));
    },
    onchange: Blockly.Blocks.tick.onchange,
};
Blockly.JavaScript.tick_string = () => ['Bot.getLastTick(false, true)', Blockly.JavaScript.ORDER_ATOMIC];

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/ticks/tick.js
