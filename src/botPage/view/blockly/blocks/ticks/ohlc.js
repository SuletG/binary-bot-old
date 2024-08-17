// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import { translate } from '../../../../../common/i18n';
import { mainScope } from '../../relationChecker';
import candleInterval, { getGranularity } from './candleInterval';
import theme from '../../theme';

Blockly.Blocks.ohlc = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Candles List'));
        candleInterval(this);
        this.setInputsInline(true);
        this.setOutput(true, 'Array');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the candle list'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Candles List');
    },
};
Blockly.JavaScript.ohlc = block => [
    `Bot.getOhlc({ granularity: ${getGranularity(block)} })`,
    Blockly.JavaScript.ORDER_ATOMIC,
];

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/ticks/ohlc.js
