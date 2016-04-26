'use strict';

/**
 * Represents a guess algorithm based on previous player throws.
 * @module GuessStrategy
 */
module.exports = function () {
    return {
        /**
         * Guess what is possible next player's throw, based on previous ones.
         * @public
         * @param {string} key - player Name for which to extract logs.
         * @param {object} logStore - keymap which contains array logs for each player. Player name serves as a key.
         * @param {Array} options - valid options for this game.
         * @param {Judge} judge - Instance of Judge.
         * @returns {string} - Gesture from options which should beat opponent.
         */
        //TODO improve this algorithm. Ex: if user predicts this algorithm, predict that user predicts this algorithm. ;)
        guess: function (key, logStore, options, judge) {
            logStore = logStore.getLogs(key);

            //4 sequence pattern seems ok.
            var length = 4;
            //we need at least length + 1 entries in logs for guess
            if(!logStore || (logStore.length <= length)) {
                return this.random(options);
            }

            //prevent too much recursion, and improve performance
            var limit = 3000;
            if(logStore.length > limit) {
                logStore = logStore.splice(logStore.length - limit, logStore.length);
            }

            //get most likely gestures opponent could play.
            var guesses = tryToGuess(logStore, length, options);

            //no reasons to guess, based on previous logs.
            if(!guesses) {
                return this.random(options);
            }

            //statistically return best match.
            var nextGuesses = summarize(guesses);

            if(nextGuesses.length === 1) {
                //One candidate for guess
                return judge.getWinningGesture(nextGuesses[0], options);
            } else {
                //pick safest gesture if possible when there is more then one guess.
                var tieOrWinOption = judge.pickWinner(nextGuesses, options);
                if(tieOrWinOption) {
                    return tieOrWinOption;
                } else {
                    //pick a random gesture from guesses.
                    return this.random(nextGuesses);
                }
            }
        },

        /**
         * Returns a random option.
         * @public
         * @param {*[]} options - array from which to pick random value.
         * @returns {*}
         */
        random: random
    };

    /**
     * Recursively check logs for repeated patterns from length to length 1
     * and returns a list of what player played after each sequence.
     * @private
     * @param {string[]} logs - previous throws.
     * @param {number} length - pattern length to start with.
     * @param {string[]} options - list of valid options.
     * @returns {*}
     */
    function tryToGuess(logs, length, options) {
        var guesses;
        while(!guesses && length) {
            guesses = guessNext(length, logs, options);
            length--;
        }
        return guesses;
    }

    /**
     * Check logs for repeated patterns for given length
     * and returns what player played after each sequence.
     * @private
     * @param {number} length - pattern length.
     * @param {string[]} logs - previous throws.
     * @param {string[]} options - list of valid options.
     * @returns {*}
     */
    function guessNext(length, logs, options) {
        var start = logs.length - length;
        var end = logs.length;
        var pattern = logs.slice(start, end);
        var results = checkPattern(start - 1, end - 1, pattern, logs, options);
        if(results.length) {
            return results;
        }
    }

    /**
     * Recursively checks logs for given pattern, and return a list of gestures
     * played after pattern from the past.
     * @private
     * @param {number} start - at which index slice start.
     * @param {number} end - at which index slice ends.
     * @param {string[]} pattern - searched pattern.
     * @param {string[]} logs - all throws from the past.
     * @param {string[]} options - valid options to select from.
     * @param {string[]} results - results from previous search
     * @returns {*}
     */
    function checkPattern(start, end, pattern, logs, options, results) {
        if(!results) {
            results = [];
        }
        if(start < 0) {
            return results;
        }
        var next = logs.slice(start, end);
        if(contains(logs[end], options) && equals(next, pattern)) {
            results.push(logs[end]);
        }

        return checkPattern(start - 1, end - 1, pattern, logs, options, results);
    }

    /**
     * Shallow check if two arrays are equal and have the same order.
     * @private
     * @param {[]} arr1
     * @param {[]} arr2
     * @returns {boolean}
     */
    function equals(arr1, arr2) {
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }

        return true;
    }

    /**
     * Checks of provided array contains provided item.
     * @private
     * @param {*} item
     * @param {[]} arr
     * @returns {boolean}
     */
    function contains(item, arr) {
        return arr.indexOf(item) > -1;
    }

    /**
     * Return random element from provided array.
     * @private
     * @param options
     * @returns {*}
     */
    function random(options) {
        var index = Math.floor(Math.random() * options.length);
        return options[index];
    }

    /**
     * Finds out which items from array appears most often.
     * @param {string[]} guesses
     * @returns {string[]}
     */
    function summarize(guesses) {
        var counts = guesses.reduce(function (acc, next) {
            acc[next] = (acc[next] || 0) + 1;
            return acc;
        }, {});

        var max, prop;
        for(prop in counts) {
            if(counts.hasOwnProperty(prop) && (!max || max < counts[prop])) {
                max = counts[prop];
            }
        }

        var gestures = [];
        for(prop in counts) {
            if(counts.hasOwnProperty(prop) && counts[prop] === max) {
                gestures.push(prop);
            }
        }

        return gestures;
    }
};
