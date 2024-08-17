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
        <form id="save-dialog" onSubmit={onSubmit} className="dialog-content" style={style.content}>
            <h4
                style={{
                    color       : '#FFB300',
                    marginBottom: '-15px',
                }}
            >
                {' '}
                {translate('File Name')}{' '}
            </h4>{' '}
            <h6
                style={{
                    color       : '#9E9E9E',
                    marginBottom: '-10px',
                }}
            >
                {' '}
                {translate('Choose filename for your blocks')}{' '}
            </h6>{' '}
            <div className="input-row">
                <input
                    id="save-filename"
                    name="save-filename"
                    title={translate('Choose filename for your blocks')}
                    type="text"
                    onChange={e => setFileName(e.target.value)}
                    defaultValue={`binary-bot-${new Date().toISOString()}`}
                    data-lpignore="true"
                    autoComplete="false"
                />
            </div>{' '}
            <h4
                style={{
                    color       : '#FFB300',
                    marginBottom: '-15px',
                }}
            >
                {' '}
                {translate('Password')}{' '}
            </h4>{' '}
            <span
                className="integration-option"
                style={{
                    marginLeft: '95px',
                    marginTop : '-5px',
                    position  : 'absolute',
                }}
            >
                <input
                    type="checkbox"
                    id="enable-password"
                    name="enable-password"
                    value="false"
                    onChange={e => toggleEnablePassword(e.target.value)}
                />{' '}
                <label htmlFor="enable-password"> </label>{' '}
            </span>{' '}
            <h6
                style={{
                    color       : '#9E9E9E',
                    marginBottom: '-10px',
                }}
            >
                {' '}
                {translate('Protect your code with a password (max 21 characteres)')}{' '}
            </h6>{' '}
            {enablePassword && (
                <div className="input-row">
                    <input
                        id="save-password"
                        name="save-password"
                        title={translate('Protect your code with a password (max 20 characteres)')}
                        type="text"
                        onChange={e => setFilePassword(e.target.value)}
                        defaultValue=""
                        maxLength="20"
                        data-lpignore="true"
                        autoComplete="false"
                        disabled={!enablePassword}
                    />{' '}
                </div>
            )}{' '}
            {/* <p>{translate('You can leave the password blank to not use it')}</p> */}{' '}
            <h4
                style={{
                    color       : '#FFB300',
                    marginBottom: '-15px',
                }}
            >
                {' '}
                {translate('Account ID')}{' '}
            </h4>{' '}
            <span
                className="integration-option"
                style={{
                    marginLeft: '105px',
                    marginTop : '-5px',
                    position  : 'absolute',
                }}
            >
                <input
                    type="checkbox"
                    id="enable-accountid"
                    name="enable-accountid"
                    value="false"
                    onChange={e => toggleEnableAccountid(e.target.value)}
                />{' '}
                <label htmlFor="enable-accountid"> </label>{' '}
            </span>{' '}
            <h6
                style={{
                    color       : '#9E9E9E',
                    marginBottom: '-10px',
                }}
            >
                {' '}
                {translate('Specify what account can use this script (the account has letters and numbers)')}{' '}
            </h6>{' '}
            {enableAccountid && (
                <div className="input-row">
                    <input
                        id="save-clientid"
                        name="save-clientid"
                        title={translate(
                            'Specify what account can use this script (the account has letters and numbers)'
                        )}
                        type="text"
                        onChange={e => setFileClientid(e.target.value)}
                        defaultValue=""
                        maxLength="20"
                        data-lpignore="true"
                        autoComplete="false"
                        disabled={!enableAccountid}
                    />{' '}
                </div>
            )}
            <h4
                style={{
                    color       : '#FFB300',
                    marginBottom: '-15px',
                }}
            >
                {' '}
                {translate('Expiration Date')}{' '}
            </h4>{' '}
            <span
                className="integration-option"
                style={{
                    marginLeft: '140px',
                    marginTop : '-5px',
                    position  : 'absolute',
                }}
            >
                <input
                    type="checkbox"
                    id="enable-expiration"
                    name="enable-expiration"
                    value="false"
                    onChange={e => toggleEnableExpiration(e.target.value)}
                />{' '}
                <label htmlFor="enable-expiration"> </label>{' '}
            </span>{' '}
            <h6
                style={{
                    color       : '#9E9E9E',
                    marginBottom: '-10px',
                }}
            >
                {' '}
                {translate('Specify a date for the expiration of the script in the format YYYY-MM-DD')}{' '}
            </h6>{' '}
            {enableExpiration && (
                <div className="input-row">
                    <input
                        id="save-expiration"
                        name="save-expiration"
                        title={translate('Specify a date for the expiration of the script in the format YYYY-MM-DD')}
                        type="text"
                        onBlur={e => checkExpiryDate(e.target.value)}
                        defaultValue=""
                        maxLength="20"
                        data-lpignore="true"
                        autoComplete="false"
                        disabled={!enableExpiration}
                    />{' '}
                </div>
            )}{' '}
            {/* <p>{translate('You can leave the account id blank to not use it')}</p> */}{' '}
            <div
                className="input-row center-text"
                style={{
                    marginTop   : '35px',
                    marginBottom: '-15px',
                }}
            >
                <span className="integration-option">
                    <input
                        type="checkbox"
                        id="save-local"
                        name="save-option"
                        value="false"
                        // defaultChecked
                        onChange={e => setHideBlocks(e.target.checked)}
                    />{' '}
                    <label htmlFor="save-local"> {translate('Hide Blocks')} </label>{' '}
                </span>
                <span className="integration-option">
                    <input
                        type="checkbox"
                        id="show-trade"
                        name="show-option"
                        value="false"
                        // defaultChecked
                        disabled={!hideBlocks}
                        onChange={e => setShowTrade(e.target.checked)}
                    />{' '}
                    <label htmlFor="show-trade"> {translate('Show Trade Block')} </label>{' '}
                </span>{' '}
                {/* {isGdLoggedIn && (
                                <span className="integration-option">
                                    <input
                                        type="radio"
                                        id="save-google-drive"
                                        name="save-option"
                                        value={SAVE_LOAD_TYPE.google_drive}
                                        onChange={onChange}
                                    />
                                    <label htmlFor="save-google-drive">Google Drive</label>
                                </span>
                            )} */}{' '}
            </div>{' '}
            <h6>
                {' '}
                {translate(
                    'Attention, if this option is checked when saving this file, there is no way to view or edit the blocks when loaded. In the same way, it is not possible to disable this option on the saved file'
                )}{' '}
            </h6>{' '}
            {/* <div id="collection" className="input-row">
                            <input
                                title={translate(
                                    'Save your blocks individually in a collection. They will be added to your existing workspace (main blocks will be replaced) when loaded.'
                                )}
                                name="save-is-collection"
                                id="save-is-collection"
                                type="checkbox"
                                onChange={onChange}
                                style={style.checkbox}
                            />
                            <label
                                title={translate(
                                    'Save your blocks individually in a collection. They will be added to your existing workspace (main blocks will be replaced) when loaded.'
                                )}
                                htmlFor="save-is-collection"
                            >
                                {translate('Save as collection')}
                            </label>
                            <div className="description">
                                {translate('Save your blocks and settings for re-use in other strategies')}
                            </div>
                        </div> */}{' '}
            <div className="center-text input-row last">
                <button type="submit"> {translate('Save')} </button>{' '}
            </div>{' '}
        </form>
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
        super(
            'save-dialog',
            translate('Save blocks'),
            <Save onSave={onSave} closeDialog={closeDialog} />,
            style.dialogLayout
        );
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
// ./src/botPage/view/Dialogs/SaveDialog.js
