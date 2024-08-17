import Observer from '../../common/utils/observer';
import Interpreter from './Interpreter';
import TicksService from '../common/TicksService';
import { generateLiveApiInstance } from '../../common/appId';

export const createScope = () => {
    const observer = new Observer();
    const api = generateLiveApiInstance();
    const virtualApi = generateLiveApiInstance();

    const ticksService = new TicksService(api);

    return {
        observer,
        api,
        virtualApi,
        ticksService,
    };
};

export const createInterpreter = () => new Interpreter();

// WEBPACK FOOTER //
// ./src/botPage/bot/CliTools.js
