/**
 * A delayed execution utility function as per name.
 * @module DelayedExecutor
 * @param {function} func - callback which will be called at specified timeout with provided arguments.
 * @param {number} timeout - timeout at witch function should be called.
 * @param {Array} args - Array of arguments to pass to function.
 */
module.exports = function (func, timeout, args) {
    setTimeout(function () {
        func.apply(null, args);
    }, timeout);
};
