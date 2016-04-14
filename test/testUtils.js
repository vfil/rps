module.exports = {
    /**
     * Original counter modification for testing purpose
     * @param counts
     * @param countInterval
     * @param count_cb
     * @param end_cb
     */
    counterFunc: function (counts, countInterval, count_cb, end_cb) {
        counts.forEach(function (count, index) {
            count_cb(count);
            if (index == counts.length - 1) {
                end_cb();
            }
        });
    },
    //monkey patch that just works, if needed more often:
    // implement middleware that applies to store instead of hacking the store.
    patchStore: function(store) {
        var actions = [];
        var nextDispatch = store.dispatch;
        store.dispatch = function(action) {
            actions.push(action);
            nextDispatch(action);
        };

        return function() {
            return actions;
        }
    }
};