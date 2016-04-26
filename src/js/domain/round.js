'use strict';
/**
 * Round class. Represents a round in a game.
 * @module Round
 * @param {Player[]} players - a collection of players participants to the game.
 * @param {string[]} gestures - a collection of gestures players can choose.
 */
module.exports = function (players, gestures) {

    /**
     * A flag to indicate that round is finished.
     * @private
     * @type {boolean}
     */
    var scored = false;

    return {
        /**
         * Finds out winner of the round. When undefined - there is no winner it this round.
         * Will throw an error if same round is scored more than once.
         * Will validate provided gestures an throw an error if not valid.
         * @public
         * @returns {Player|null}
         */
        score: function (judge) {
            if(this.isScored()) {
                throw new Error('Rule violation, it is impossible to play same round. Calling score multiple times is prohibited');
            }
            scored = true;
            if(gestures.length < 3 || !(gestures.length % 2)) {
                throw new Error('Rule violation, gestures length should be at least 3 and odd number');
            }

            var bets = players.map(getGesture);
            var gesture = judge.pickWinner(bets, gestures);
            if(gesture) {
                return findByGesture(gesture, players);
            }

            return null;
        },

        /**
         * Returns whether this round is finished or not.
         * @public
         * @returns {boolean}
         */
        isScored: function () {
            return scored;
        }
    };

    function getGesture(player) {
        return player.getGesture();
    }

    function findByGesture(gesture, players) {
        return players.reduce(function(prev, nextPlayer) {
            return hasGesture(nextPlayer, gesture) ? nextPlayer : prev;
        }, null);
    }

    function hasGesture(player, gesture) {
        return player.getGesture() === gesture;
    }
};
