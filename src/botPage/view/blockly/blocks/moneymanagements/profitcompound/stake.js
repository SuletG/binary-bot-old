// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import { mainScope } from '../../../relationChecker';
import { translate } from '../../../../../../common/i18n';
import theme from '../../../theme';

Blockly.Blocks.profitcompound_stake = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Profit Compound Stake'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the actual stake calculated based on the Profit Compound money management'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Stake');
    },
};
Blockly.JavaScript.profitcompound_stake = () => ['Bot.profitCompoundStake()'];

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/profitcompound/stake.js
