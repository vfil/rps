'use strict';

/**
 * Player class
 * @param {string} name - player name
 * @param {Boolean} isHuman - is player human or bot
 */
module.exports = function (name, isHuman) {

    var gesture;

    return {
        /**
         * Player name getter.
         * @returns {string}
         */
        getName: function () {
            return name;
        },

        /**
         * Player gesture setter
         * @param {string} newGesture - new player gesture to play with
         */
        setGesture: function (newGesture) {
            gesture = newGesture;
        },

        /**
         * Player gesture getter
         * @returns {string}
         */
        getGesture: function () {
            return gesture;
        },

        /**
         * Player human or bot flag getter
         * @returns {Boolean}
         */
        isHuman: function () {
            return isHuman;
        }
    }
};