'use strict';
/**
 * Round class. Represents a round in a game.
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
         * @returns {Player|undefined}
         */
        score: function () {
            scored = true;
            var winners = players.filter(isWinner);
            return winners[0];
        },

        /**
         * Returns whether this round is finished or not.
         * @returns {boolean}
         */
        isScored: function () {
            return scored;
        }
    };

    /**
     * Function predicate which compares provided player to other,
     * to find out winner of the round.
     * @private
     * @param {Player} player
     * @param {number} index
     * @returns {boolean}
     */
    function isWinner(player, index) {

        var positions = players.map(getGesturePosition);

        var currentPosition = positions[players.indexOf(player)];

        return positions.every(function (position, nextIndex) {
            if (index === nextIndex) {
                return true;
            } else {
                return isGreater(currentPosition, position) === 1;
            }
        });
    }

    /**
     * Function predicate to find winning player.
     * Uses an algorithm of parity of choices.
     * If it is the same (two odd-numbered moves or two even-numbered ones) then the lower number wins,
     * while if they are different (one odd and one even) the higher wins.
     * Relies on provided order of gestures.
     * This algorithm works only with balanced games.
     * @param {number} x - position of gesture player by player x
     * @param {number} y - position of gesture player by player y
     * @returns {number}
     */

    //TODO Add possibility to play unbalanced games, ex: a strategy pattern.
    //TODO Unbalanced game algorithm can rely on Graph objects with vertices as gestures and directed edges as relations.
    function isGreater(x, y) {

        if (x === y) {
            return 0;
        }

        if (sameParity(x, y)) {
            return x < y ? 1 : -1;
        } else {
            return x > y ? 1 : -1;
        }
    }

    function getGesturePosition(player) {
        return gestures.indexOf(player.getGesture()) + 1;
    }

    function sameParity(num1, num2) {
        return (num1 & 1) === (num2 & 1);
    }

};