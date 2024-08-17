/* eslint-disable import/no-extraneous-dependencies */
import 'jquery-ui/ui/widgets/dialog';
import 'notifyjs-browser';
import View from './View';
import '../../common/binary-ui/dropdown';
// import Elevio from '../../common/elevio';
import GTM from '../../common/gtm';
import { parseQueryString, isProduction } from '../../common/utils/tools';
import { queryToObjectArray, addTokenIfValid, AppConstants } from '../../common/appId';
import { getTokenList, set as setStorage, get as getStorage } from '../../common/utils/storageManager';

$.ajaxSetup({
    cache: false,
});

// eslint-disable-next-line no-underscore-dangle
window._trackJs = {
    token      : process.env.TRACKJS_TOKEN,
    application: 'binary-bot',
    enabled    : isProduction(),
    console    : {
        display: false,
    },
};

// Should stay below the window._trackJs config
// require('trackjs');

const view = new View();

view.initPromise().then(() => {
    // console.log('end view');
    // if (trackJs) {
    //     trackJs.configure({
    //         userId: $('.account-id')
    //             .first()
    //             .text(),
    //     });
    // }

    const queryStr = parseQueryString();

    if (window.location.search[1] === 'p' && !getStorage('promoter')) {
        setStorage(AppConstants.STORAGE_PROMOTER, window.location.search.split('?p=')[1]);
        window.history.replaceState(null, null, window.location.pathname);
    }

    const tokenObjectList = queryToObjectArray(queryStr);
    if (tokenObjectList.length > 0) {
        window.history.replaceState(null, null, window.location.pathname);
        addTokenIfValid(tokenObjectList[0].token, tokenObjectList).then(async () => {
            const accounts = getTokenList();
            if (accounts.length) {
                setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, accounts[0].token);
            }
            window.history.replaceState(null, null, window.location.pathname);
            await view.UpdateTokenList();
            const fn = accounts.length ? 'show' : 'hide';
            console.log(fn);
            $('#runButton, #runButtonBottom, #showSummary, #logButton, #tradingViewButton, #load-xml')
                [fn]()
                .prevAll('.toolbox-separator:first')
                [fn]();
        });
    } else if (!view.blockly.auth.account_list) {
        $('#overlay').fadeIn();
        setTimeout(() => $('#welcomeLoginButton').click(), 500);
    }

    $('#sidebar-toggle-action').click();
    $('.show-on-load').show();
    $('.show-on-load-flex').css('display', 'flex');
    $('#bottom-player').css('display', 'flex');
    $('#toolbox').css('display', 'flex');
    $('.show-on-load-table').css('display', 'table');
    $('.lds-roller').hide();
    $('#hidden-blocks-message').hide();
    window.dispatchEvent(new Event('resize'));
    GTM.init();
});

// WEBPACK FOOTER //
// ./src/botPage/view/index.js
