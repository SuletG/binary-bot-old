export default Engine =>
    class Lists extends Engine {
        getTheHighestValue = ({ values }) => Math.max(...values);
        getTheLowestValue = ({ values }) => Math.min(...values);
        getIndexWhen = ({ values, condition, value }) => {
            const index = values.findIndex(element => {
                if (condition === 'eq' && element === value) {
                    return true;
                } else if (condition === 'ne' && element !== value) {
                    return true;
                } else if (condition === 'gt' && element > value) {
                    return true;
                } else if (condition === 'lt' && element < value) {
                    return true;
                } else if (condition === 'gte' && element >= value) {
                    return true;
                } else if (condition === 'lte' && element <= value) {
                    return true;
                }
                return false;
            });
            return index > -1 ? values.length - index : -1;
        };
    };

// WEBPACK FOOTER //
// ./src/botPage/bot/TradeEngine/Lists.js
