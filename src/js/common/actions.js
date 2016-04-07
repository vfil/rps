'use strict';

var utils = require('./utils');

/**
 * @private
 */
var types = {
    GESTURE_CHANGE: null,
    COUNTDOWN: null,
    SCORE: null,
    ADD_BOT: null,
    REMOVE_BOT: null
};

var typesObj = utils.generateDynamicProps(types, keyMirror);
/**
 * Action creators provider object.
 * See source code to add more or explore actions types.
 * @module Actions
 */
module.exports = {
    //Types of actions that are matched by reducer function.
    types: typesObj,

    gestureChange: function (player, gesture) {
        return {
            type: this.types.GESTURE_CHANGE,
            gesture: gesture,
            player: player
        }
    },

    countdown: function (count) {
        return {
            type: this.types.COUNTDOWN,
            count: count
        }
    },

    score: function (winner) {
        return {
            type: this.types.SCORE,
            winner: winner
        }
    },

    addBot: function () {
        return {
            type: this.types.ADD_BOT
        }
    },

    removeBot: function () {
        return {
            type: this.types.REMOVE_BOT
        }
    }
};

/**
 * Helper function to assign values as keys strings.
 * @param key
 * @private
 * @returns {*}
 */
function keyMirror(key) {
    return key;
}