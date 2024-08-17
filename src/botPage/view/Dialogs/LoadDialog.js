import PropTypes from 'prop-types';
import React from 'react';
import Dialog from './Dialog';
import { SAVE_LOAD_TYPE } from './utils';
import LoadingButton from './LoadingButton';
import * as style from '../style';
import { translate } from '../../../common/i18n';
// import googleDriveUtil from '../../../common/integrations/GoogleDrive';
// import { observer as globalObserver } from '../../../common/utils/observer';

const Load = React.memo(({ closeDialog }) => {
    const [loadType, setLoadType] = React.useState(SAVE_LOAD_TYPE.local);
    const [isLoading, setLoading] = React.useState(false);
    const [filePassword, setFilePassword] = React.useState('');
    const [enablePassword, setEnablePassword] = React.useState(false);
    // const [filePassword, setFilePassword] = React.useState('');
    // const [isGdLoggedIn, setGdLoggedIn] = React.useState(false);

    // const isMounted = useIsMounted();

    // React.useEffect(() => {
    //     globalObserver.register('googledrive.authorised', data => setGdLoggedIn(data));
    // }, []);

    const onChange = e => setLoadType(e.target.value);

    const toggleEnablePassword = () => {
        setFilePassword('');
        setEnablePassword(!enablePassword);
    };

    const onSubmit = e => {
        e.preventDefault();

        if (loadType === SAVE_LOAD_TYPE.google_drive) {
            setLoading(true);

            // googleDriveUtil
            //     .createFilePicker()
            //     .then(() => closeDialog())
            //     .finally(() => isMounted() && setLoading(false));
        } else {
            document.getElementById('files').click();
            closeDialog();
        }
    };

    return (
        <form id="load-dialog" className="dialog-content" style={style.content} onSubmit={onSubmit}>
            {' '}
            {/* <div className="center-text input-row">
                            <span className="integration-option">
                                <input
                                    type="radio"
                                    id="load-local"
                                    name="load-option"
                                    value={SAVE_LOAD_TYPE.local}
                                    defaultChecked
                                    onChange={onChange}
                                />
                                <label htmlFor="load-local">{translate('My computer')}</label>
                            </span>
                            {isGdLoggedIn && (
                                <span className="integration-option">
                                    <input
                                        type="radio"
                                        id="load-google-drive"
                                        name="load-option"
                                        value={SAVE_LOAD_TYPE.google_drive}
                                        onChange={onChange}
                                    />
                                    <label htmlFor="load-google-drive">Google Drive</label>
                                </span>
                            )}
                        </div> */}{' '}
            <h4
                style={{
                    color: '#FFB300',
                }}
            >
                {' '}
                {translate('Password')}{' '}
            </h4>{' '}
            <span
                className="integration-option"
                style={{
                    marginLeft: '95px',
                    marginTop : '-45px',
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
                    marginTop   : '-14px',
                }}
            >
                {' '}
                {translate('In case the script you will load have a password, enable it')}{' '}
            </h6>{' '}
            {enablePassword && (
                <div className="input-row">
                    <input
                        id="load-password"
                        name="load-password"
                        title="In case the script you will load have a password, input it here"
                        type="text"
                        // onChange={e => setFilePassword(e.target.value)}
                        defaultValue=""
                        maxLength="20"
                        data-lpignore="true"
                        autoComplete="false"
                    />
                </div>
            )}{' '}
            {/* <p>{translate('In case the script you will load have a password, input it here. Otherwise, leave it blank')}</p> */}{' '}
            <div className="center-text input-row last">
                <button id="load-strategy" type="submit" disabled={isLoading}>
                    {' '}
                    {isLoading ? <LoadingButton /> : translate('Load')}{' '}
                </button>{' '}
            </div>{' '}
        </form>
    );
});

Load.propTypes = {
    closeDialog: PropTypes.func.isRequired,
};

export default class LoadDialog extends Dialog {
    constructor() {
        const closeDialog = () => {
            this.close();
        };
        super('load-dialog', translate('Load blocks'), <Load closeDialog={closeDialog} />, style.dialogLayout);
        this.registerCloseOnOtherDialog();
    }
}

// WEBPACK FOOTER //
// ./src/botPage/view/Dialogs/LoadDialog.js
