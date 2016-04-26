'use strict';

/**
 * A storage for past throws.
 * @module LogStore
 * @returns {object}
 */
module.exports = function() {
    /**
     * Internal map for storage. key - player name, value collection of throws.
     * @private
     * @type {object}
     */
    var logs = {};

    return {
        /**
         * Push a throw to the store.
         * @public
         * @param {string} key - player name.
         * @param {string} value - throw.
         */
        record: function(key, value) {
            //TODO persist logs.
            if(logs[key]) {
                logs[key].push(value);
            } else {
                logs[key] = [value];
            }
        },

        /**
         * Returns logs for a given key.
         * @public
         * @param {string} key - key at which logs are stored.
         * @returns {string[]}
         */
        getLogs: function (key) {
            return logs[key];
        }
    }
};
