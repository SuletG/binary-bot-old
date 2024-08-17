import { translate } from '../../../../../../common/i18n';
import { mainScope } from '../../../relationChecker';
import theme from '../../../theme';
import candleInterval, { getGranularity } from '../../ticks/candleInterval';

Blockly.Blocks.bullish_fractal = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Is Bullish Fractal'));
        candleInterval(this);
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('True if the candle pattern ending in the actual candle is a bullish fractal'));
    },
    onchange: function onchange(ev) {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        });
        mainScope(this, ev, 'Bullish Fractal');
    },
};

Blockly.JavaScript.bullish_fractal = block => [
    `Bot.isBullishFractal({ granularity: ${getGranularity(block)} })`,
    Blockly.JavaScript.ORDER_ATOMIC,
];

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/patterns/bullish_fractal.js