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
         * Player human or bot flag getter
         * @public
         * @returns {Boolean}
         */
        isHuman: function () {
            return !!isHuman;
        }
    }
};