import {
    Aroon as A,
    ADX,
    ATR,
    AwesomeOscillator as AO,
    BollingerBands as BB,
    CCI,
    CHOP,
    EMA,
    HMA,
    IchimokuCloud as IC,
    KST,
    KeltnerChannels as KC,
    MACD,
    PSAR,
    ROC,
    RSI,
    SMA,
    SWMA,
    Stochastic as S,
    StochasticRSI as SRSI,
    Supertrend as ST,
    TMA,
    TRIX,
    WEMA,
    WMA,
    WilliamsR as WR,
} from '../technicalindicators';

const v3 = () => ({
    high : [],
    low  : [],
    close: [],
});
const v2 = () => ({
    high: [],
    low : [],
});

export default Interface =>
    class extends Interface {
        method = t => (t === 'latest' ? 'pop' : 'slice');

        complex = (params, candles, values) =>
            Object.assign(
                candles.reduce(
                    (p, c) =>
                        Object.keys(p).reduce((p1, c1) => {
                            p[c1].push(c[c1]);
                            return p;
                        }, p),
                    { ...values }
                ),
                params
            );

        simple = (params, candles, values) =>
            Object.assign(
                candles.reduce(
                    (p, c) =>
                        Object.keys(p).reduce((p1, c1) => {
                            p[c1].push(c[c1]);
                            return p;
                        }, p),
                    { ...values }
                ),
                params
            );
        /* eslint-disable max-len */
        getIndicatorsInterface = () => ({
            aroon: (params, candles, field, returnType) =>
                A.calculate(this.complex(params, candles, v3()))
                    .map(key => key[field])
                    [this.method(returnType)](),
            adx: (params, candles, field, returnType) =>
                ADX.calculate(this.complex(params, candles, v3()))
                    .map(key => key[field])
                    [this.method(returnType)](),
            ao: (params, candles, returnType) =>
                AO.calculate(this.complex(params, candles, v3()))[this.method(returnType)](),
            atr: (params, candles, returnType) =>
                ATR.calculate(this.complex(params, candles, v3()))[this.method(returnType)](),
            bb: (params, field, returnType) =>
                BB.calculate(params)
                    .map(key => key[field])
                    [this.method(returnType)](),
            chop: (params, candles, returnType) =>
                CHOP.calculate(this.complex(params, candles, v3()))[this.method(returnType)](),
            cci: (params, candles, returnType) =>
                CCI.calculate(this.complex(params, candles, v3()))[this.method(returnType)](),
            ema          : (params, returnType) => EMA.calculate(params)[this.method(returnType)](),
            hma          : (params, returnType) => HMA.calculate(params)[this.method(returnType)](),
            ichimokucloud: (params, candles, field, returnType) =>
                IC.calculate(this.simple(params, candles, v2()))
                    .map(key => key[field])
                    [this.method(returnType)](),
            kc: (params, candles, field, returnType) =>
                KC.calculate(this.complex(params, candles, v3()))
                    .map(key => key[field])
                    [this.method(returnType)](),
            kst: (params, field, returnType) =>
                KST.calculate(params)
                    .map(key => key[field])
                    [this.method(returnType)](),
            macd: (params, field, returnType) =>
                MACD.calculate(params)
                    .map(key => key[field])
                    [this.method(returnType)](),
            psar: (params, candles, returnType) =>
                PSAR.calculate(this.complex(params, candles, v2()))[this.method(returnType)](),
            roc       : (params, returnType) => ROC.calculate(params)[this.method(returnType)](),
            rsi       : (params, returnType) => RSI.calculate(params)[this.method(returnType)](),
            sma       : (params, returnType) => SMA.calculate(params)[this.method(returnType)](),
            stochastic: (params, candles, field, returnType) =>
                S.calculate(this.complex(params, candles, v3()))
                    .map(key => key[field])
                    [this.method(returnType)](),
            stochasticrsi: (params, field, returnType) =>
                SRSI.calculate(params)
                    .map(key => key[field])
                    [this.method(returnType)](),
            supertrend: (params, candles, field, returnType) =>
                ST.calculate(this.complex(params, candles, v3()))
                    .map(key => key[field])
                    [this.method(returnType)](),
            swma     : (params, returnType) => SWMA.calculate(params)[this.method(returnType)](),
            tma      : (params, returnType) => TMA.calculate(params)[this.method(returnType)](),
            trix     : (params, returnType) => TRIX.calculate(params)[this.method(returnType)](),
            wema     : (params, returnType) => WEMA.calculate(params)[this.method(returnType)](),
            williamsr: (params, candles, returnType) =>
                WR.calculate(this.complex(params, candles, v3()))[this.method(returnType)](),
            wma: (params, returnType) => WMA.calculate(params)[this.method(returnType)](),
        });
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/Interface/IndicatorsInterface.js
