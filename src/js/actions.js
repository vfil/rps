'use strict';

var utils = require('./common/utils');

/**
 * @private
 */
var types = {
    INIT_STATE: null,
    GESTURE_CHANGE: null,
    COUNTDOWN: null,
    COUNTDOWN_START: null,
    SET_BOTS_GESTURE: null,
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

    /**
     * Action to replace current state with new state.
     * @public
     * @param {object} initialState
     * @returns {object}
     */
    initState: function (initialState) {
        return {
            type: this.types.INIT_STATE,
            state: initialState
        }
    },
    /**
     * Action to set gesture for player.
     * @public
     * @param {string} playerName
     * @param {string} gesture
     * @returns {object}
     */
    gestureChange: function (playerName, gesture) {
        return {
            type: this.types.GESTURE_CHANGE,
            gesture: gesture,
            playerName: playerName
        }
    },
    /**
     * Action to set gesture for bot player.
     * @returns {object}
     */
    setBotsGestures: function () {
        return {
            type: this.types.SET_BOTS_GESTURE
        }
    },
    /**
     * Action to mark state with countdown start event.
     * @returns {object}
     */
    countdownStart: function () {
        return {
            type: this.types.COUNTDOWN_START
        }
    },
    /**
     * Action to compute state on next countdown event.
     * @param {string} count
     * @returns {object}
     */
    countdown: function (count) {
        return {
            type: this.types.COUNTDOWN,
            count: count
        }
    },
    /**
     * Action for scoring the game.
     * @param {Player|null} winner
     * @returns {object}
     */
    score: function (winner) {
        return {
            type: this.types.SCORE,
            winner: winner
        }
    },
    /**
     * Action to add a new bot to the game.
     * @param {Player} bot
     * @returns {object}
     */
    addBot: function (bot) {
        return {
            type: this.types.ADD_BOT,
            player: bot
        }
    },
    /**
     * Action to remove last bot from the game.
     * @returns {object}
     */
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