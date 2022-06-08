import React from 'react'
import { set as setStorage, remove } from '../../../common/utils/storageManager';
import { expirationDate, setPopupToken, renderPopup, setTimeOutBanner, setTimeOutPopup } from '../../index';
import { translate } from '../../../common/i18n';

const setDueDateAgain = () => {
    remove('setDueDateForBanner');
    remove('setPopupToken');
    setStorage('setDueDateForBanner', expirationDate());
    setStorage('setPopupToken', setPopupToken());
    renderPopup('close');
    setTimeOutBanner()
    setTimeOutPopup()
}

const ModalComponent = () => (
    <div className='bot-landing-alert-draggable-dialog draggable-dialog'>
        <h1>{translate('Use Binary Bot on Deriv, our new home')}</h1>
        <p>{translate('In 5 minutes, we’ll show you the benefits of trading Binary Bot on Deriv.If you ignore this message, we’ll remind you again in 3 weeks.')}</p>
        <div className='bot-landing-alert-btn-group'>
            <button className='default' onClick={setDueDateAgain}>{translate('ok')}</button>
            <a href="https://bot.deriv.com" target="_blank">
                <button className='primary'>{translate('Take me to Binary Bot on Deriv')}</button>
            </a>
        </div>
    </div>
)

export default ModalComponent