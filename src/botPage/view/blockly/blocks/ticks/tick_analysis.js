// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#i7qkfj
import { translate } from '../../../../../common/i18n';
import theme from '../../theme';

Blockly.Blocks.tick_analysis = {
    init: function init() {
        this.appendDummyInput().appendField(translate('This block is called on every tick'), 'titleWarn');
        this.appendStatementInput('TICKANALYSIS_STACK').setCheck(null);
        this.setColour(theme.warnColor);
        this.setTooltip(translate('You can use this block to analyze the ticks, regardless of your trades'));
    },
    onchange: function onchange() {
        Blockly.utils.addClass(this.getField('titleWarn').textElement_, 'title-warn-block');
    },
};

Blockly.JavaScript.tick_analysis = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'TICKANALYSIS_STACK');
    return `
    BinaryBotPrivateTickAnalysisList.push(function BinaryBotPrivateTickAnalysis() {
      ${stack}
    });
  `;
};

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/ticks/tick_analysis.js
