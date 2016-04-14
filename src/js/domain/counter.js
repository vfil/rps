/**
 * A Function which provides an iteration with callback executions at certain interval.
 * @module Counter
 * @param {Array} counts - An array to traverse.
 * @param {number} countInterval - Interval in milliseconds for callback execution.
 * @param {function} count_cb - callback executed at countInterval interval with next item in array as argument.
 * @param {function} end_cb - callback called when at end of iteration. Execution is also delayed at countInterval.
 */
module.exports = function(counts, countInterval, count_cb, end_cb) {
    counts.forEach(function (count, index) {
        setTimeout(function () {
            count_cb(count);
            if (index == counts.length - 1) {
                setTimeout(end_cb, countInterval);
            }
        }, index * countInterval);
    });
};