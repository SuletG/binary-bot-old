import { translate } from '../../../../../common/i18n';
import theme from '../../theme';

Blockly.Blocks.go_back_to_virtual = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Go Back To Virtual Trades'));
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(
            translate(
                'It will tell the system to use the connected virtual account in the next trade. If the virtual trades settings are disabled, it will be ignored'
            )
        );
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
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};

Blockly.JavaScript.go_back_to_virtual = () => 'BinaryBotPrivateVirtualSettings.changeToVirtual = true;';

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/virtualtrades/gobacktovirtual.js
