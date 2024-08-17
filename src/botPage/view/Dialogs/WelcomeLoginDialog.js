import PropTypes from 'prop-types';
import React from 'react';
import Dialog from './Dialog';
// import { SAVE_LOAD_TYPE } from './utils';
import LoadingButton from './LoadingButton';
// import { cleanBeforeExport } from '../blockly/utils';
import * as style from '../style';
import { translate } from '../../../common/i18n';
// import googleDriveUtil from '../../../common/integrations/GoogleDrive';
// import { observer as globalObserver } from '../../../common/utils/observer';

const Save = React.memo(({ closeDialog, onSave }) => {
    // const [isLoading, setLoading] = React.useState(false);
    const [fileName, setFileName] = React.useState(`binary-bot-${new Date().toISOString()}`);
    const [filePassword, setFilePassword] = React.useState('');
    const [fileClientid, setFileClientid] = React.useState('');
    const [fileExpiration, setFileExpiration] = React.useState('');
    // const [saveType, setSaveType] = React.useState(SAVE_LOAD_TYPE.local);
    const [hideBlocks, setHideBlocks] = React.useState(false);
    const [showTrade, setShowTrade] = React.useState(false);
    const [enablePassword, setEnablePassword] = React.useState(false);
    const [enableAccountid, setEnableAccountid] = React.useState(false);
    const [enableExpiration, setEnableExpiration] = React.useState(false);
    // const [isGdLoggedIn, setGdLoggedIn] = React.useState(false);

    // const isMounted = useIsMounted();

    // React.useEffect(() => {
    //     globalObserver.register('googledrive.authorised', data => setGdLoggedIn(data));
    // }, []);

    // const onChange = e =>
    // e.target.type === 'checkbox' ? setSaveType(e.target.value) : setSaveAsCollection(e.target.checked);

    const toggleEnablePassword = () => {
        setFilePassword('');
        setEnablePassword(!enablePassword);
    };

    const toggleEnableAccountid = () => {
        setFileClientid('');
        setEnableAccountid(!enableAccountid);
    };

    const toggleEnableExpiration = () => {
        setFileExpiration('');
        setEnableExpiration(!enableExpiration);
    };

    const checkExpiryDate = dateString => {
        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
        console.log(dateFormatRegex.test(dateString));
        if (!dateFormatRegex.test(dateString)) {
            const inputElement = document.getElementById('save-expiration');
            if (inputElement) {
                inputElement.value = '';
            }
            setFileExpiration('');
            return false;
        }

        const isValidDate = !isNaN(new Date(dateString).getTime());
        if (isValidDate) {
            setFileExpiration(dateString);
        } else {
            const inputElement = document.getElementById('save-expiration');
            console.log(inputElement);
            if (inputElement) {
                inputElement.value = '';
            }
            setFileExpiration('');
        }
        return isValidDate;
    };

    const onSubmit = e => {
        e.preventDefault();

        // if (saveType === SAVE_LOAD_TYPE.local) {
        //     onSave({ fileName, filePassword, fileClientid, hideBlocks, showTrade });
        //     closeDialog();
        //     return;
        // }

        onSave({
            fileName,
            filePassword  : enablePassword ? filePassword : '',
            fileClientid  : enableAccountid ? fileClientid : '',
            hideBlocks,
            showTrade     : hideBlocks ? showTrade : false,
            fileExpiration: enableExpiration ? fileExpiration : '',
        });
        closeDialog();

        // setLoading(true);
        // const xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        // cleanBeforeExport(xml);
        // xml.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        // xml.setAttribute('collection', saveAsCollection);
        // closeDialog();
        // googleDriveUtil
        //     .saveFile({
        //         name    : fileName,
        //         content : Blockly.Xml.domToPrettyText(xml),
        //         mimeType: 'application/xml',
        //     })
        //     .then(() => globalObserver.emit('ui.log.success', translate('Successfully uploaded to Google Drive')))
        //     .finally(() => isMounted() && setLoading(false));
    };

    return (
        <div
            style={{
                padding: '20px',
            }}
        >
            <h2
                style={{
                    textAlign: 'center',
                    color    : 'white',
                    margin   : 0,
                }}
            >
                {' '}
                Welcome to{' '}
            </h2>{' '}
            <div
                className="logo-wrapper-welcome"
                style={{
                    textAlign: 'center',
                    width    : '100%',
                    display  : 'block',
                }}
            >
                <a href={'https://copytrad.in/affiliate'} target={'blank'} id={'logo'}>
                    <div className="logo-parent">
                        <div className="binary-logo-text">
                            <img
                                className="responsive"
                                style={{
                                    width: '100%!important',
                                }}
                            />{' '}
                        </div>{' '}
                    </div>{' '}
                </a>{' '}
            </div>{' '}
            <p
                style={{
                    textAlign: 'center',
                    fontSize : '14px',
                }}
            >
                {' '}
                Unshackle your trades with the genius of <b> Binary Ex Machina </b> under the brand of{' '}
                <a href={'https:/ / tradder.ai / '} target={'blank '} style={{ color: '#42A5F5' }}>
                    Tradder.ai
                </a>
                . This compact platform defies binary norms, offering exclusive features for a trading experience beyond
                the ordinary. Welcome to the future – where freedom meets function!
            </p>
            <div
                className="center-text input-row last"
                style={{
                    borderTop : '1px solid #414141',
                    paddingTop: '20px',
                }}
            >
                <button
                    style={{
                        backgroundColor: '#f1b90c',
                        color          : 'black',
                    }}
                    onClick={() => {
                        $('#login').click();
                    }}
                >
                    {' '}
                    {translate('Login with your Deriv account')}{' '}
                </button>{' '}
            </div>{' '}
            <p
                style={{
                    textAlign: 'center',
                }}
            >
                {' '}
                or{' '}
            </p>{' '}
            <div className="center-text input-row last">
                <button
                    style={{
                        backgroundColor: '#66BB6A',
                        color          : 'black',
                    }}
                    onClick={() => {
                        window.open('https://copytrad.in/affiliate', '_blank');
                    }}
                >
                    {' '}
                    {translate('Create an account')}{' '}
                </button>{' '}
            </div>{' '}
            <p
                style={{
                    textAlign : 'center',
                    fontSize  : '10px',
                    paddingTop: '40px',
                }}
            >
                Deriv offers complex derivatives, such as options and contracts for difference(“CFDs”).These products
                may not be suitable for all clients, and trading them puts you at risk.Please make sure that you
                understand the following risks before trading Deriv products: a) you may lose some or all of the money
                you invest in the trade, b) if your trade involves currency conversion, exchange rates will affect your
                profit and loss.You should never trade with borrowed money or with money that you cannot afford to lose.{' '}
            </p>{' '}
        </div>
    );
});

Save.propTypes = {
    closeDialog: PropTypes.func.isRequired,
    onSave     : PropTypes.func.isRequired,
};

export default class SaveDialog extends Dialog {
    constructor() {
        const closeDialog = () => {
            this.close();
        };
        const onSave = arg => {
            this.limitsPromise(arg);
            closeDialog();
        };
        super('welcome-login-dialog', '', <Save onSave={onSave} closeDialog={closeDialog} />, {
            height   : 'auto',
            width    : '50em',
            resizable: false,
            create(event, ui) {
                $(this)
                    .prev('.ui-dialog-titlebar')
                    .css({
                        display: 'none',
                    });
            },
        });
        this.registerCloseOnOtherDialog();
    }

    save() {
        this.open();
        return new Promise(resolve => {
            this.limitsPromise = resolve;
        });
    }
}

// WEBPACK FOOTER //
// ./src/botPage/view/Dialogs/WelcomeLoginDialog.js
