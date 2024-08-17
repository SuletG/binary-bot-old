import CryptoJS from 'crypto-js';
import './customBlockly';
import blocks from './blocks';
import {
    isMainBlock,
    save,
    disable,
    deleteBlocksLoadedBy,
    addLoadersFirst,
    cleanUpOnLoad,
    addDomAsBlock,
    backwardCompatibility,
    fixCollapsedBlocks,
    fixArgumentAttribute,
    removeUnavailableMarkets,
    strategyHasValidTradeTypeCategory,
    cleanBeforeExport,
    importFile,
    saveBeforeUnload,
    removeParam,
    updateRenamedFields,
    getPreviousStrat,
} from './utils';
import Interpreter from '../../bot/Interpreter';
import { translate, xml as translateXml } from '../../../common/i18n';
import { parseQueryString, isProduction } from '../../../common/utils/tools';
import { getLanguage } from '../../../common/lang';
import { observer as globalObserver } from '../../../common/utils/observer';
import { showDialog } from '../../bot/tools';
import GTM from '../../../common/gtm';
import { TrackJSError } from '../logger';
import { createDataStore } from '../../bot/data-collection';
import config from '../../common/const';
import { createError } from '../../common/error';

let isProtected = false;

let accountInfo = {};

globalObserver.register('accountInfo', info => {
    accountInfo = info;
});

export const getIsProtected = () => isProtected;

const disableStrayBlocks = () => {
    const topBlocks = Blockly.mainWorkspace.getTopBlocks();
    topBlocks.forEach(block => {
        if (
            !isMainBlock(block.type) &&
            ['block_holder', 'tick_analysis', 'loader', 'procedures_defreturn', 'procedures_defnoreturn'].indexOf(
                block.type
            ) < 0 &&
            !block.disabled
        ) {
            disable(block, translate('Blocks must be inside block holders, main blocks or functions'));
        }
    });
};

const disposeBlocksWithLoaders = () => {
    Blockly.mainWorkspace.addChangeListener(ev => {
        saveBeforeUnload();
        if (ev.type === 'delete' && ev.oldXml.getAttribute('type') === 'loader' && ev.group !== 'undo') {
            deleteBlocksLoadedBy(ev.blockId, ev.group);
        }
    });
};

const marketsWereRemoved = xml => {
    if (!Array.from(xml.children).every(block => !removeUnavailableMarkets(block))) {
        // if (window.trackJs && isProduction()) {
        //     trackJs.track('Invalid financial market');
        // }
        showDialog({
            title  : translate('Warning'),
            text   : [translate('This strategy is not available in your country.')],
            buttons: [
                {
                    text : translate('OK'),
                    class: 'button-primary',
                    click() {
                        $(this).dialog('close');
                    },
                },
            ],
        })
            .then(() => {})
            .catch(() => {});
        return true;
    }
    return false;
};

const xmlToStr = xml => {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xml);
};

const addBlocklyTranslation = () => {
    $.ajaxPrefilter(options => {
        options.async = true; // eslint-disable-line no-param-reassign
    });
    let lang = getLanguage();
    if (lang === 'ach') {
        lang = 'en';
    } else if (lang === 'zh_cn') {
        lang = 'zh-hans';
    } else if (lang === 'zh_tw') {
        lang = 'zh-hant';
    } else if (lang === 'pt') {
        lang = 'pt-br';
    }
    return new Promise(resolve => {
        $.getScript(`translations/${lang}.js`, resolve);
    });
};

export const onresize = () => {
    let element = document.getElementById('blocklyArea');
    const blocklyArea = element;
    const blocklyDiv = document.getElementById('blocklyDiv');
    const notificationBanner = globalObserver.getState('showBanner');
    const injectionDiv = blocklyDiv.firstChild;
    const blocklyToolboxDiv = injectionDiv.firstChild;

    injectionDiv.style.overflow = 'hidden';
    blocklyToolboxDiv.style.top = '0';
    if (notificationBanner && blocklyArea.offsetWidth > 768) {
        injectionDiv.style.overflow = 'visible';
        blocklyToolboxDiv.style.top = '-6.2rem';
    }
    if (notificationBanner && blocklyArea.offsetWidth < 768) {
        blocklyToolboxDiv.style.top = '2.2rem';
    }

    let x = 0;
    let y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = `${x}px`;
    blocklyDiv.style.top = notificationBanner ? `${y + 100}px` : `${y}px`;
    blocklyDiv.style.width = `${blocklyArea.offsetWidth}px`;
    blocklyDiv.style.height = `${blocklyArea.offsetHeight}px`;
};

const render = workspace => () => {
    onresize();
    Blockly.svgResize(workspace);
    // console.log('rendered');
};

const overrideBlocklyDefaultShape = () => {
    const addDownloadToMenu = block => {
        if (block instanceof Object) {
            // eslint-disable-next-line no-param-reassign, max-len
            block.customContextMenu = function customContextMenu(options) {
                options.push({
                    text    : translate('Download'),
                    enabled : true,
                    callback: () => {
                        const xml = Blockly.Xml.textToDom(
                            '<xml xmlns="http://www.w3.org/1999/xhtml" collection="false"></xml>'
                        );
                        xml.appendChild(Blockly.Xml.blockToDom(this));
                        save('binary-bot-block', true, xml);
                    },
                });
            };
        }
    };
    Object.keys(Blockly.Blocks).forEach(blockName => {
        const downloadDisabledBlocks = ['controls_forEach', 'controls_for', 'variables_get', 'variables_set'];
        if (!downloadDisabledBlocks.includes(blockName)) {
            addDownloadToMenu(Blockly.Blocks[blockName]);
        }
    });
};

const repaintDefaultColours = () => {
    Blockly.Msg.LOGIC_HUE = '#2b313a';
    Blockly.Msg.LOOPS_HUE = '#2b313a';
    Blockly.Msg.MATH_HUE = '#2b313a';
    Blockly.Msg.TEXTS_HUE = '#2b313a';
    Blockly.Msg.LISTS_HUE = '#2b313a';
    Blockly.Msg.COLOUR_HUE = '#2b313a';
    Blockly.Msg.VARIABLES_HUE = '#2b313a';
    Blockly.Msg.VARIABLES_DYNAMIC_HUE = '#2b313a';
    Blockly.Msg.PROCEDURES_HUE = '#2b313a';

    Blockly.Blocks.logic.HUE = '#2b313a';
    Blockly.Blocks.loops.HUE = '#2b313a';
    Blockly.Blocks.math.HUE = '#2b313a';
    Blockly.Blocks.texts.HUE = '#2b313a';
    Blockly.Blocks.lists.HUE = '#2b313a';
    Blockly.Blocks.colour.HUE = '#2b313a';
    Blockly.Blocks.variables.HUE = '#2b313a';
    Blockly.Blocks.procedures.HUE = '#2b313a';
};

export const load = async (blockStr, format, password, dropEvent = {}) => {
    let blockS = blockStr;
    const unrecognisedMsg = () => translate('Unrecognized file format');
    const clientid = $('.account-id')[0].innerHTML;
    let blocksSData = blockS;
    let isBlocksVisible = true;
    let isTradeBlockVisible = false;
    let sc;
    try {
        sc = await new Promise(r => {
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    r(xmlHttp.responseText);
                }
            };
            xmlHttp.open('GET', '/auth/token', true); // true for asynchronous
            xmlHttp.send(null);
        });
    } catch (error) {
        globalObserver.emit('ui.log.info', `${translate('Connection error, please try again')}`);
        return;
    }

    if (format === 'application/json') {
        try {
            const j = JSON.parse(blockS);
            try {
                const bytes = CryptoJS.AES.decrypt(j.data, sc);
                blockS = bytes.toString(CryptoJS.enc.Utf8);
                fetch('/api/scripts', {
                    method : 'POST',
                    headers: {
                        Accept        : 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data   : j.data,
                        loginid: accountInfo.loginid,
                        email  : accountInfo.email,
                    }),
                });
            } catch (error) {
                globalObserver.emit('ui.log.info', `${translate('File is not supported or with errors')}`);
                return;
            }

            blockS = JSON.parse(blockS);
            blocksSData = blockS.data;

            if (blockS.expiration) {
                if (new Date().getTime() > new Date(blockS.expiration).getTime()) {
                    globalObserver.emit(
                        'ui.log.error',
                        `${translate('This script expired at')} ${blockS.expiration}, ${translate(
                            'it cannot be used anymore'
                        )}`
                    );
                    return;
                }
                globalObserver.emit(
                    'ui.log.info',
                    `${translate('This script has the expiration date of')} ${blockS.expiration}`
                );
            }

            if (blockS.hideBlocks !== undefined) {
                isBlocksVisible = !blockS.hideBlocks;
            }

            if (blockS.showTrade !== undefined) {
                isTradeBlockVisible = blockS.showTrade;
            }

            if (blockS.password !== '' && blockS.password !== password) {
                globalObserver.emit(
                    'ui.log.error',
                    `${translate('Wrong password, load the file and use the right password to open it')}`
                );
                return;
            }
            if (blockS.clientid !== '' && blockS.clientid !== clientid) {
                globalObserver.emit(
                    'ui.log.error',
                    `${translate(
                        `This account ${clientid} can't use this script, contact the owner and ask him to export again with your account code`
                    )}`
                );
                return;
            }
        } catch (e) {
            globalObserver.emit('ui.log.error', `${translate('File is not supported or with errors')}`);
            return;
        }
    }
    try {
        const xmlDoc = new DOMParser().parseFromString(blocksSData, 'application/xml');

        if (xmlDoc.getElementsByTagName('parsererror').length) {
            throw new Error();
        }
    } catch (err) {
        console.log('dom');
        const error = new TrackJSError('FileLoad', unrecognisedMsg(), err);
        globalObserver.emit('Error', error);
        return;
    }

    let xml;
    try {
        xml = Blockly.Xml.textToDom(blocksSData);
    } catch (e) {
        console.log('text');
        const error = new TrackJSError('FileLoad', unrecognisedMsg(), e);
        globalObserver.emit('Error', error);
        return;
    }

    const blocklyXml = xml.querySelectorAll('block');

    if (!blocklyXml.length) {
        const error = createError('EmptyXML', translate('XML file is empty. Please check or modify file.'));
        globalObserver.emit('Error', error);
        return;
    }

    // if (xml.hasAttribute('is_dbot')) {
    //     showDialog({
    //         title  : translate('Unsupported strategy'),
    //         text   : [translate('Sorry, this strategy can’t be used with Binary Bot. You may only use it with DBot.')],
    //         buttons: [
    //             {
    //                 text : translate('Cancel'),
    //                 class: 'button-secondary',
    //                 click() {
    //                     $(this).dialog('close');
    //                     $(this).remove();
    //                 },
    //             },
    //             {
    //                 text : translate('Take me to DBot'),
    //                 class: 'button-primary',
    //                 click() {
    //                     window.location.href = 'https://app.deriv.com/bot';
    //                 },
    //             },
    //         ],
    //     })
    //         .then(() => {})
    //         .catch(() => {});
    //     return;
    // }

    const blockWithError = Array.from(blocklyXml).find(
        block => !Object.keys(Blockly.Blocks).includes(block.getAttribute('type'))
    );
    if (blockWithError) {
        globalObserver.emit(
            'Error',
            createError(
                'InvalidBlockInXML',
                translate(
                    'The file you’re trying to open contains unsupported elements in the following block: {$0} Please check your file and try again.',
                    [blockWithError.getAttribute('id')]
                )
            )
        );
        return;
    }

    removeParam('strategy');

    try {
        if (xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true') {
            loadBlocks(xml, dropEvent);
        } else {
            loadWorkspace(xml, isBlocksVisible, isTradeBlockVisible);
        }
    } catch (e) {
        const error = new TrackJSError('FileLoad', translate('Unable to load the block file'), e);
        globalObserver.emit('Error', error);
    }
};

export const loadWorkspace = (xml, isBlocksVisible, isTradeBlockVisible) => {
    updateRenamedFields(xml);
    if (!strategyHasValidTradeTypeCategory(xml)) return;
    if (marketsWereRemoved(xml)) return;

    Blockly.Events.setGroup('load');
    Blockly.mainWorkspace.clear();

    Array.from(xml.children).forEach(block => {
        backwardCompatibility(block);
    });

    fixArgumentAttribute(xml);
    Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
    addLoadersFirst(xml).then(
        () => {
            fixCollapsedBlocks();
            Blockly.Events.setGroup(false);
            globalObserver.emit('ui.log.success', translate('Blocks are loaded successfully'));
            if (!isBlocksVisible) {
                const allBlocks = Blockly.mainWorkspace.getAllBlocks();
                const ids = [];
                const getIds = array => {
                    for (let i = 0; i < array.length; i++) {
                        const element = array[i];
                        ids.push(element.id);
                        if (element.childBlocks_.length > 0) {
                            getIds(element.childBlocks_);
                        }
                    }
                };
                if (isTradeBlockVisible) {
                    const trade = allBlocks.find(a => a.type === 'trade');
                    ids.push(trade.id);
                    getIds(trade.childBlocks_);
                }
                for (let index = 0; index < allBlocks.length; index++) {
                    const element = allBlocks[index];
                    if (!ids.find(a => a === element.id)) {
                        element.svgGroup_.remove();
                    }
                }
                $('#save-xml')[0].disabled = true;
                $('#save-xml')[0].style['pointer-events'] = 'none';
                $('#save-xml')[0].style.opacity = '0.5';
                $('#hidden-blocks-message').show();
                $('.blocklyToolboxDiv').remove();
                isProtected = true;
            } else {
                $('#save-xml')[0].disabled = false;
                $('#save-xml')[0].style['pointer-events'] = 'all';
                $('#save-xml')[0].style.opacity = '1';
                $('#hidden-blocks-message').hide();
                isProtected = false;
            }
        },
        e => {
            Blockly.Events.setGroup(false);
            throw e;
        }
    );
};

export const loadBlocks = (xml, dropEvent = {}) => {
    updateRenamedFields(xml);
    if (!strategyHasValidTradeTypeCategory(xml)) return;
    if (marketsWereRemoved(xml)) return;

    const variables = xml.getElementsByTagName('variables');
    if (variables.length > 0) {
        Blockly.Xml.domToVariables(variables[0], Blockly.mainWorkspace);
    }
    Blockly.Events.setGroup('load');
    addLoadersFirst(xml).then(
        loaders => {
            const addedBlocks = [
                ...loaders,
                ...Array.from(xml.children)
                    .map(block => addDomAsBlock(block))
                    .filter(b => b),
            ];
            cleanUpOnLoad(addedBlocks, dropEvent);
            fixCollapsedBlocks();
            globalObserver.emit('ui.log.success', translate('Blocks are loaded successfully'));
        },
        e => {
            throw e;
        }
    );
};

export default class _Blockly {
    constructor(auth) {
        this.generatedJs = '';
        this.auth = auth;
        // eslint-disable-next-line no-underscore-dangle
        Blockly.WorkspaceSvg.prototype.preloadAudio_ = () => {}; // https://github.com/google/blockly/issues/299
    }

    initPromise = () =>
        new Promise(resolve => {
            $.get('xml/toolbox.xml', toolboxXml => {
                blocks();

                // const CustomRenderer = function(name) {
                //     CustomRenderer.superClass_.constructor.call(this, name);
                // };
                // Blockly.utils.object.inherits(CustomRenderer, Blockly.blockRendering.Renderer);

                // Blockly.blockRendering.register('custom_renderer', CustomRenderer);
                const workspace = Blockly.inject('blocklyDiv', {
                    toolbox: xmlToStr(translateXml(toolboxXml.getElementsByTagName('xml')[0])),
                    zoom   : {
                        wheel: false,
                    },
                    trashcan: false,
                    renderer: 'custom_renderer',
                });
                workspace.addChangeListener(event => {
                    if (event.type === Blockly.Events.BLOCK_CREATE) {
                        event.ids.forEach(id => {
                            const block = workspace.getBlockById(id);
                            if (block) {
                                GTM.pushDataLayer({
                                    event     : 'Block Event',
                                    blockEvent: event.type,
                                    blockType : block.type,
                                });
                            }
                        });
                    } else if (event.type === Blockly.Events.BLOCK_DELETE) {
                        const dom = Blockly.Xml.textToDom(`<xml>${event.oldXml.outerHTML}</xml>`);
                        const blockNodes = dom.getElementsByTagName('block');
                        Array.from(blockNodes).forEach(blockNode => {
                            GTM.pushDataLayer({
                                event     : 'Block Event',
                                blockEvent: event.type,
                                blockType : blockNode.getAttribute('type'),
                            });
                        });
                    }
                });
                const renderInstance = render(workspace);
                window.addEventListener('resize', renderInstance, false);
                renderInstance();
                addBlocklyTranslation().then(() => {
                    const loadDomToWorkspace = dom => {
                        repaintDefaultColours();
                        overrideBlocklyDefaultShape();
                        Blockly.Xml.domToWorkspace(dom, workspace);
                        this.zoomOnPlusMinus();
                        disposeBlocksWithLoaders();
                        setTimeout(() => {
                            saveBeforeUnload();
                            this.cleanUp();
                            // Blockly.mainWorkspace.cleanUp();
                            Blockly.mainWorkspace.clearUndo();
                        }, 0);
                    };

                    let defaultStrat = parseQueryString().strategy;

                    if (!defaultStrat || !config.quick_strategies.includes(defaultStrat)) {
                        // const previousStrat = getPreviousStrat();

                        // if (previousStrat) {
                        //     const previousStratDOM = Blockly.Xml.textToDom(previousStrat);
                        //     loadDomToWorkspace(previousStratDOM);
                        //     resolve(Blockly);
                        //     return;
                        // }

                        defaultStrat = 'main';
                    }

                    const xmlFile = `xml/${defaultStrat}.xml`;
                    const getFile = xml => {
                        importFile(xml).then(dom => {
                            loadDomToWorkspace(dom.getElementsByTagName('xml')[0]);
                            resolve(Blockly);
                        });
                    };
                    getFile(xmlFile);
                });

                createDataStore(workspace);
                workspace.scrollX = 200;
            });
        });
    /* eslint-disable class-methods-use-this */
    zoomOnPlusMinus(zoomIn) {
        const metrics = Blockly.mainWorkspace.getMetrics();
        if (zoomIn) {
            Blockly.mainWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, 1);
        } else {
            Blockly.mainWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, -1);
        }
    }
    resetWorkspace() {
        importFile('xml/main1.xml').then(async dom => {
            Blockly.Events.setGroup('reset');
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace(dom.getElementsByTagName('xml')[0], Blockly.mainWorkspace);
            Blockly.Events.setGroup(false);
            this.cleanUp();
            const topBlocks = Blockly.mainWorkspace.getTopBlocks(true);
            await new Promise(r => setTimeout(r, 10));
            topBlocks[0].inputList[1].fieldRow[1].setValue('synthetic_index');
            await new Promise(r => setTimeout(r, 10));
            topBlocks[0].inputList[1].fieldRow[3].setValue('random_index');
            await new Promise(r => setTimeout(r, 10));
            topBlocks[0].inputList[1].fieldRow[5].setValue('R_100');

            $('#save-xml')[0].disabled = false;
            $('#save-xml')[0].style['pointer-events'] = 'all';
            $('#save-xml')[0].style.opacity = '1';
            $('#hidden-blocks-message').hide();
            isProtected = false;
        });
    }
    resetPlusWorkspace() {
        importFile('xml/main.xml').then(async dom => {
            Blockly.Events.setGroup('reset');
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace(dom.getElementsByTagName('xml')[0], Blockly.mainWorkspace);
            Blockly.Events.setGroup(false);
            this.cleanUp();
            const topBlocks = Blockly.mainWorkspace.getTopBlocks(true);
            await new Promise(r => setTimeout(r, 10));
            topBlocks[0].inputList[1].fieldRow[1].setValue('synthetic_index');
            await new Promise(r => setTimeout(r, 10));
            topBlocks[0].inputList[1].fieldRow[3].setValue('random_index');
            await new Promise(r => setTimeout(r, 10));
            topBlocks[0].inputList[1].fieldRow[5].setValue('R_100');

            $('#save-xml')[0].disabled = false;
            $('#save-xml')[0].style['pointer-events'] = 'all';
            $('#save-xml')[0].style.opacity = '1';
            $('#hidden-blocks-message').hide();
            isProtected = false;
        });
    }
    /* eslint-disable class-methods-use-this */
    cleanUp() {
        Blockly.Events.setGroup(true);
        const topBlocks = Blockly.mainWorkspace.getTopBlocks(true);
        let cursorY = 0;
        let cursorX = 0;
        let maxWidth = 0;
        topBlocks.forEach(block => {
            if (block.getSvgRoot().style.display !== 'none') {
                const xy = block.getRelativeToSurfaceXY();
                block.moveBy(cursorX - xy.x, cursorY - xy.y);
                block.snapToGrid();
                maxWidth = Math.max(maxWidth, block.getHeightWidth().width);
                cursorY =
                    block.getRelativeToSurfaceXY().y + block.getHeightWidth().height + Blockly.BlockSvg.MIN_BLOCK_Y;
                if (cursorY > document.documentElement.scrollHeight) {
                    cursorY = 0;
                    cursorX += maxWidth + 25;
                }
            }
        });
        Blockly.Events.setGroup(false);
        Blockly.mainWorkspace.resizeContents();
    }
    /* eslint-disable class-methods-use-this */
    save(arg) {
        const {
            fileName: filename,
            filePassword: filepassword,
            fileClientid: fileclientid,
            hideBlocks,
            showTrade,
            fileExpiration: fileexpiration,
        } = arg;
        saveBeforeUnload();
        const xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        cleanBeforeExport(xml);
        save(filename, filepassword, fileclientid, hideBlocks, showTrade, xml, fileexpiration);
    }
    run(limitations = {}) {
        disableStrayBlocks();
        let code;
        try {
            code = `
var BinaryBotPrivateInit, BinaryBotPrivateStart, BinaryBotPrivateBeforePurchase, BinaryBotPrivateDuringPurchase, BinaryBotPrivateAfterPurchase;

var BinaryBotPrivateLastTickTime
var BinaryBotPrivateTickAnalysisList = [];
var BinaryBotPrivateVirtualSettings = {
    token: '',
    countOnLoss: true,
    minTradesOnReal: 1,
    maxTradesOnReal: 10,
    goBack: true,
    active: false,
    maxSteps: 3,
    reset: true
};

function BinaryBotPrivateRun(f, arg) {
 if (f) return f(arg);
 return false;
}

function BinaryBotPrivateTickAnalysis() {
 var currentTickTime = Bot.getLastTick(true).epoch
 if (currentTickTime === BinaryBotPrivateLastTickTime) {
   return
 }
 BinaryBotPrivateLastTickTime = currentTickTime
 for (var BinaryBotPrivateI = 0; BinaryBotPrivateI < BinaryBotPrivateTickAnalysisList.length; BinaryBotPrivateI++) {
   BinaryBotPrivateRun(BinaryBotPrivateTickAnalysisList[BinaryBotPrivateI]);
 }
}
var BinaryBotPrivateLimitations = ${JSON.stringify(limitations)};
${Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace)}

BinaryBotPrivateRun(BinaryBotPrivateInit);

while(true) {
 BinaryBotPrivateTickAnalysis();
 BinaryBotPrivateRun(BinaryBotPrivateStart)
 while(watch('before')) {
   BinaryBotPrivateTickAnalysis();
   BinaryBotPrivateRun(BinaryBotPrivateBeforePurchase);
 }
 while(watch('during')) {
   BinaryBotPrivateTickAnalysis();
   BinaryBotPrivateRun(BinaryBotPrivateDuringPurchase);
 }
 BinaryBotPrivateTickAnalysis();
 if(!BinaryBotPrivateRun(BinaryBotPrivateAfterPurchase)) {
   break;
 }
}`;

            // eslint-disable-next-line no-console
            // console.log(code);
            this.generatedJs = code;
            if (code) {
                this.stop(true);
                this.interpreter = new Interpreter(this.auth);
                this.interpreter.run(code).catch(e => {
                    globalObserver.emit('Error', e);
                    this.stop();
                });
            }
        } catch (e) {
            globalObserver.emit('Error', e);
            this.stop();
        }
    }
    stop(stopBeforeStart) {
        if (!stopBeforeStart) {
            const elRunButtons = document.querySelectorAll('#runButton, #runButtonBottom, #summaryRunButton');
            const elStopButtons = document.querySelectorAll('#stopButton, #stopButtonBottom, #summaryStopButton');

            elRunButtons.forEach(el => {
                const elRunButton = el;
                elRunButton.style.display = 'initial';
            });
            elStopButtons.forEach(el => {
                const elStopButton = el;
                elStopButton.style.display = null;
            });
        }
        if (this.interpreter) {
            this.interpreter.stop();
            this.interpreter = null;
        }
    }
    /* eslint-disable class-methods-use-this */
    undo() {
        Blockly.Events.setGroup('undo');
        Blockly.mainWorkspace.undo();
        Blockly.Events.setGroup(false);
    }
    /* eslint-disable class-methods-use-this */
    redo() {
        Blockly.mainWorkspace.undo(true);
    }
    /* eslint-disable class-methods-use-this */
    hasStarted() {
        return this.interpreter && this.interpreter.hasStarted();
    }
    /* eslint-enable */
}

// WEBPACK FOOTER //
// ./src/botPage/view/blockly/index.js
