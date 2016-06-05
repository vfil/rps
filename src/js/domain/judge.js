'use strict';

/**
 * Serves for determining the gestures relationships.
 * @module Judge
 */
module.exports = function () {
    return {
        /**
         * Determines who is the winner from provided collection of bets.
         * @param {string[]} bets - player's throws (or bets).
         * @param {string[]} options - all possible options.
         * @returns {string|null}
         */
        pickWinner: function (bets, options) {
            var positions = bets.map(getGesturePosition(options));
            var winnerPositions = positions.filter(isWinner);
            if(winnerPositions[0]) {
                var index = winnerPositions[0] - 1;
                return options[index];
            }

            return null;
        },
        /**
         * Given a bet determines which would be the bet that wins it.
         * @param {string} bet - one from options collection.
         * @param {string[]} options - collection of bets.
         * @returns {string}
         */
        getWinningGesture: function(bet, options) {
            var position = getPosition(bet, options);
            //this gesture should beat provided bet even if we have more then 3 gestures
            var index = (position + 1) % options.length;
            return options[index];
        }
    };

    /**
     * Function predicate which compares bets positions to other
     * to find out winner of the round.
     * @private
     * @param {number} currentPosition - position to which we compare another to find out potential winner.
     * @param {number} index - index of currentPosition in positions.
     * @param {number[]} positions - collection of positions for bets.
     * @returns {boolean}
     */
    function isWinner(currentPosition, index, positions) {
        return positions.every(function (position, nextIndex) {
            if (index === nextIndex) {
                //this is the same position we want to check if it is winner position.
                //So skip checking.
                return true;
            } else {
                return isGreater(currentPosition, position) === 1;
            }
        });
    }

    /**
     * Returns position of player's gesture in current gestures.
     * Position count starts from 1.
     * @private
     * @param {string} options
     * @returns {function}
     */
    function getGesturePosition(options) {
        return function(bet) {
            var position = getPosition(bet, options);
            //returns position starting form one, not as array index from 0
            return position + 1;
        };
    }

    /**
     * Returns position of bet in options.
     * Throws an error if options doesn't contains bet.
     * @param {string} bet
     * @param {string[]} options
     * @returns {number}
     */
    function getPosition(bet, options) {
        var position = options.indexOf(bet);
        //validate
        if(position === -1) {
            throw new Error('Option ' + bet + ' is not valid');
        }
        return position;
    }

    /**
     * Function predicate to find winning bet by its position.
     * Uses parity of choices algorithm.
     * If it is the same (two odd-numbered moves or two even-numbered ones) then the lower number wins,
     * while if they are different (one odd and one even) the higher wins.
     * Relies on provided order of gestures.
     * This algorithm works only with balanced games.
     * returns 0 if gestures are equals,1 if x wins y, otherwise -1.
     * @private
     * @param {number} x - position of gesture x
     * @param {number} y - position of gesture y
     * @returns {number}
     */

    //TODO Add possibility to play unbalanced games.
    //TODO Unbalanced game algorithm rely on Graph objects with vertices as gestures and directed edges as relations.
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

    /**
     * Check if two numbers have same parity.
     * Internally uses bitwise operation to compare last bit.
     * @private
     * @param {number} num1
     * @param {number} num2
     * @returns {boolean}
     */
    function sameParity(num1, num2) {
        return (num1 & 1) === (num2 & 1);
    }

};
