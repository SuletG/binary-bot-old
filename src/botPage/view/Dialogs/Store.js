import PropTypes from 'prop-types';
import React from 'react';
import Dialog from './Dialog';
import * as style from '../style';
import { translate } from '../../../common/i18n';

const Save = React.memo(({ onChange }) => {
    const [strategy, setStrategy] = React.useState('none');

    const changeStrategy = str => {
        setStrategy(str);
        onChange(str);
    };

    return (
        <div className="main-strategy-list">
            <ul className="main-list">
                <li className="category">
                    Even / Odd{' '}
                    <ul>
                        <li>
                            <button onClick={() => changeStrategy('even_odd_percentage')}> EO Percentage </button>{' '}
                            <button onClick={() => changeStrategy('even_odd_alternating')}> Alternating </button>{' '}
                        </li>{' '}
                    </ul>{' '}
                </li>{' '}
                <li className="category">
                    Higher / Lower{' '}
                    <ul>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('higher_lower_switcher')}> Switcher </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('higher_lower_fast_barrier_changer')}>
                                {' '}
                                Fast Barrier Changer{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('higher_lower_auto_barrier')}> Auto Barrier </button>
                        </li>
                    </ul>{' '}
                </li>{' '}
                <li className="category">
                    Macthes / Differs{' '}
                    <ul>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('matches_differs_zig_zag')}>
                                {' '}
                                Zig - Zag Digits{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('matches_differs_frequent_digits')}>
                                {' '}
                                Frequent 50 Digits{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('matches_differs_double_digit')}>
                                {' '}
                                Double Digits{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('matches_differs_5_ticks')}> Matches 5 Ticks </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('matches_differs_sequential_differs')}>
                                {' '}
                                Sequential Differs{' '}
                            </button>
                        </li>
                    </ul>{' '}
                </li>{' '}
                <li className="category">
                    Over / Under{' '}
                    <ul>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('over_under_sequence')}> Over Sequence </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('over_under_pred_changer')}>
                                {' '}
                                Prediction Changer{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('over_under_no_martingale')}> No Martingale </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('over_under_multiple_prediction')}>
                                {' '}
                                Multiple Predictions{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('over_under_compound')}> Over Compound </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('over_under_69')}> Over Under 69 </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('over_under_27')}> Over Under 27 </button>
                        </li>
                    </ul>{' '}
                </li>{' '}
                <li className="category">
                    Rise / Fall{' '}
                    <ul>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_4_12_cross')}> SMA Cross </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_above_below')}> Above and Below </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_aroon_ticks')}> Over Compound </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_bb_slow')}> BB Slow </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_candle_colors')}> Candle Colors </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_candle_pattern')}>
                                {' '}
                                Candle Patterns{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_detrended')}> Detrended </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_ema_cci_cross')}> CCI EMA Cross </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_ema_cross')}> EMA Cross </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_end_of_candle')}> End of Candle </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_fast_macd')}> Fast MACD </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_highs_lows')}> Highs and Lows </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_ichimoku')}> Ichimoku </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_keltener_sma')}> Keltener SMA </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_macd_rsi_ticks')}> MACD RSI Ticks </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_rsi_cci_engulfing')}>
                                {' '}
                                Engulfing RSI & CCI{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_sma_macd_kc')}> SMA, MACD, and KC </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_stochastic_crosser')}>
                                {' '}
                                Stochastic Crosser{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_tripple_hma')}> Tripple HMA </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_chop_ema_stochrsi')}>
                                {' '}
                                Chop, EMA, and Stoch RSI{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_4_mas')}> 4 Moving Averages </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_tripple_rsi')}> 4 Moving Averages </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_macd')}> Tripple MACD </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_high_tower')}> High Tower </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_ema_macd_stoch_atr')}>
                                {' '}
                                EMA, MACD, Stoch, and ATR{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_same_direction_sma')}>
                                {' '}
                                Same Direction SMA{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_reversal_candles_end')}>
                                {' '}
                                Reversal Candle 's End
                            </button>
                        </li>{' '}
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_candle_trend_continuation')}>
                                {' '}
                                Candle Trend Continuation{' '}
                            </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_tripple_trix')}> Tripple Trix </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_past_patterns')}> Past Patterns </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_atr_change')}> ATR Change </button>
                        </li>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('rise_fall_3_bbs_extreme')}> 3 BBs Extremes </button>
                        </li>
                    </ul>{' '}
                </li>{' '}
                <li className="category">
                    Touch / No Touch{' '}
                    <ul>
                        <li>
                            {' '}
                            <button onClick={() => changeStrategy('touch_no_touch_cci_touch')}> CCI Touch </button>
                        </li>
                    </ul>{' '}
                </li>{' '}
            </ul>{' '}
        </div>
    );
});

Save.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default class StoreDialog extends Dialog {
    constructor() {
        const closeDialog = () => {
            this.close();
        };

        const onChange = arg => {
            this.limitsPromise(arg);
            closeDialog();
        };
        super('store-dialog', translate('Bot Store'), <Save closeDialog={closeDialog} onChange={onChange} />, {
            height   : 'auto',
            width    : '78em',
            resizable: false,
        });
        this.registerCloseOnOtherDialog();
    }

    change() {
        this.open();
        return new Promise(resolve => {
            this.limitsPromise = resolve;
        });
    }
}

// WEBPACK FOOTER //
// ./src/botPage/view/Dialogs/Store.js
