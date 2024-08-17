import { translate } from '../../../../../../common/i18n';
import theme from '../../../theme';
import candleInterval, { getGranularity } from '../../ticks/candleInterval';

Blockly.Blocks.hanging_man_pattern = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Is Hanging Man'));
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField(translate('Index'));
        candleInterval(this);
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('True if the candle is hanging man pattern'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        });
        for (let index = 0; index < this.svgGroup_.children.length; index++) {
            const a = this.svgGroup_.children[index];
            if (a.tagName === 'g' && a.classList.length === 0) {
                a.children[3].children[0].style.fill = theme.indicatorColorAccent;
                a.children[1].style.fill = theme.blockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};

Blockly.JavaScript.hanging_man_pattern = block => [
    `Bot.isHangingManPattern({ granularity: ${getGranularity(block)}, index: ${Blockly.JavaScript.valueToCode(
        block,
        'INDEX',
        Blockly.JavaScript.ORDER_ATOMIC
    ) || '1'} })`,
    Blockly.JavaScript.ORDER_ATOMIC,
];

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/patterns/hanging_man_pattern.js