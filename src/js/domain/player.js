'use strict';

/**
 * Player class.
 * @module Player
 * @param {string} name - player name
 * @param {Boolean} isHuman - is player human or bot
 */
module.exports = function Player(name, isHuman) {
    /**
     * Current selected gesture.
     * @private
     */
    var gesture;
    var wins = 0;

    return {
        /**
         * Player name getter.
         * @public
         * @returns {string}
         */
        getName: function () {
            return name;
        },

        /**
         * Player gesture setter
         * @public
         * @param {string} newGesture - new player gesture to play with
         */
        setGesture: function (newGesture) {
            gesture = newGesture;
        },

        /**
         * Player gesture getter
         * @public
         * @returns {string}
         */
        getGesture: function () {
            return gesture;
        },

        /**
         * Resets player's gesture.
         * @public
         */
        resetGesture: function () {
            gesture = null;
        },

        /**
         * Player human or bot flag getter
         * @public
         * @returns {Boolean}
         */
        isHuman: function () {
            return !!isHuman;
        },

        /**
         * Increments by one current player wins number.
         * @public
         */
        incrementWins: function() {
            wins++;
        },

        /**
         * Returns current player wins count.
         * @returns {number}
         */
        getWins: function () {
            return wins;
        }
    }
};