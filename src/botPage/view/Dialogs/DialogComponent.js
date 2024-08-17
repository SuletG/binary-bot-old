import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import 'jquery-ui/ui/widgets/dialog';

const createDialog = (
    el,
    title,
    {
        height = 150,
        width = 300,
        resize,
        resizable = true,
        classes = {
            'ui-dialog-titlebar-close': 'icon-close',
        },
        create = function() {},
    }
) => {
    $(el).dialog({
        resizable,
        height,
        width,
        title,
        autoOpen : false,
        closeText: '',
        classes,
        resize,
        create,
    });
};
export default class PanelComponent extends PureComponent {
    render() {
        const { id, content, title, options } = this.props;
        return (
            <div id={id} ref={el => createDialog(el, title, options)}>
                {' '}
                {content}{' '}
            </div>
        );
    }
    static props = {
        id     : PropTypes.string,
        title  : PropTypes.string,
        content: PropTypes.object,
        options: PropTypes.object,
    };
}

// WEBPACK FOOTER //
// ./src/botPage/view/Dialogs/DialogComponent.js
