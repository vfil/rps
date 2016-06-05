module.exports = {
    //monkey patch that just works, if needed more often:
    // implement middleware that applies to store instead of hacking the store.
    patchStore: function (store) {
        var actions = [];
        var nextDispatch = store.dispatch;
        store.dispatch = function (action) {
            actions.push(action);
            nextDispatch(action);
        };

        return function () {
            return actions;
        };
    },

    delayedExecutor: function (func, timeout, args, context) {
        func.apply(context, args);
    },

    containsClass: function (str, cls) {
        return (' ' + str + ' ').indexOf(' ' + cls + ' ') > -1;
    },

    stripChildren: function (props) {
        delete props.children;
        return props;
    }
};
