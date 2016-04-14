'use strict';
var Round = require('./round.js');
/**
 * Game class. Exposes API to interact with core application.
 * @module Game
 */
module.exports = function () {

    /**
     * current instance of round.
     * @private
     * @type {Round}
     */
    var round;

    return {
        /**
         * Creates a new round. Throws an error if an attempt to start a new round
         * while current round exists and not yet scored
         * @public
         * @param {Player[]} players - players in this round.
         * @param {string[]} gestures - gestures in this round.
         */
        startRound: function (players, gestures) {
            if(!round || round.isScored()) {
                round = Round(players, gestures);
            } else {
                throw new Error('Rule violation, round must be scored before starting new one!!!');
            }
        },
        /**
         * Score current round. Returns a Player or null in case of TIE score.
         * Will throw an error if round was not started before.
         * @public
         * @returns {Player|null}
         */
        score: function() {
            if(!round) {
                throw new Error('Rule violation, round must be started before scoring game!!!');
            }

            return round.score();
        }
    };
};