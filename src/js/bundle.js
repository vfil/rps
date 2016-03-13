/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	(function () {
	    var eventEmitter = __webpack_require__(5)();
	    var Game = __webpack_require__(1);
	    var Player = __webpack_require__(2);
	    var View = __webpack_require__(4);
	
	    //initialize game gestures and players
	    var gestures = ['rock', 'paper', 'scissors'];
	    var players = [Player('Foo', true), Player('Computer')];
	    var counts = ['Ro!', 'Sham!', 'Bo!!!'];
	
	    Game(players, gestures, counts, eventEmitter);
	    View(players, gestures, eventEmitter);
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Generic game class
	 * @param {Player[]} players - a collection of players participants to the game.
	 * @param {string[]} gestures - a collection of gestures players can choose.
	 * @param {string[]} counts - a collection of string for counting in game Ex: ['Ro!', 'Sham!', 'Bo!!!'].
	 * @param {EventEmitter} eventEmitter - a event system used for intercomponent communication
	 */
	module.exports = function (players, gestures, counts, eventEmitter) {
	
	    var Round = __webpack_require__(3);
	
	    /**
	     * A reference to current game round.
	     * @private
	     * @type {Round}
	     */
	    var round;
	
	    //subscribe to player gesture actions
	    eventEmitter.on('gestureChange', onGestureChange);
	
	    /**
	     *  Round kickstarter.
	     * @private
	     */
	    function start() {
	
	        //select random gesture for bots
	        players.filter(function (player) {
	            return !player.isHuman();
	        }).forEach(function (player) {
	            var randomIndex = Math.floor(Math.random() * gestures.length);
	            player.setGesture(gestures[randomIndex]);
	        });
	
	        //send out event to inform components to lock users choice.
	        eventEmitter.emit('countdownStart');
	
	        round = Round(players, gestures, eventEmitter);
	
	        //countdown provided words
	        count(function () {
	            eventEmitter.emit('score', round.score());
	        });
	    }
	
	    /**
	     * Countdown function.
	     * @param {function} cb - called when countdown finished.
	     */
	    function count(cb) {
	        counts.forEach(function (count, index) {
	            (function (count) {
	                setTimeout(function () {
	                    eventEmitter.emit('countdown', count);
	                    if (index == counts.length - 1) {
	                        cb();
	                    }
	                }, index * 1000);
	            })(count);
	        });
	    }
	
	    /**
	     * Handler of players gesture actions
	     * @param {object} message
	     */
	    function onGestureChange(message) {
	
	        //kickstart next round if none or current finished.
	        if (!round || round.isScored()) {
	            start();
	        }
	
	        //apply player selection
	        players.forEach(function (player) {
	            if (player === message.player) {
	                player.setGesture(message.gesture);
	            }
	        });
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function (players, gestures, eventEmitter) {
	
	    //handlers
	    eventEmitter.on('activeButtonChange', onActiveButtonChange);
	
	    var infoArea = document.createElement('div');
	    infoArea.className = 'info-area';
	    document.body.appendChild(infoArea);
	
	    var containers = players
	      .filter(function (player) {
	          return player.isHuman();
	      })
	      .map(function (player) {
	          var container = document.createElement('div');
	          gestures.forEach(function (gesture) {
	              var button = document.createElement('button');
	              button.className = 'punch';
	              button.innerText = gesture;
	              container.appendChild(button);
	              (function (player, gesture) {
	                  button.onclick = function () {
	                      eventEmitter.emit('gestureChange', {player: player, gesture: gesture});
	                      eventEmitter.emit('activeButtonChange', {container: container, button: button});
	                  };
	              })(player, gesture)
	          });
	
	          return container;
	      });
	
	    //append button groups
	    containers.forEach(function (container) {
	        document.body.appendChild(container);
	    });
	
	    eventEmitter.on('countdown', function (count) {
	        infoArea.innerText = count;
	    });
	
	    eventEmitter.on('score', function (winner) {
	        setTimeout(function () {
	            infoArea.innerText = winner ? winner.getName() + " Wins!!!" : 'TIE';
	            setTimeout(function() {
	                enableButtons();
	            }, 500);
	        }, 1000);
	    });
	
	    eventEmitter.on('countdownStart', function () {
	        containers.forEach(function (container) {
	            var buttons = Array.prototype.slice.call(container.childNodes);
	            buttons.forEach(function (button) {
	                button.disabled = true;
	            });
	        });
	    });
	
	    //TODO not DRY!!!
	    function enableButtons() {
	        containers.forEach(function (container) {
	            var buttons = Array.prototype.slice.call(container.childNodes);
	            buttons.forEach(function (button) {
	                button.disabled = false;
	            });
	        });
	    }
	
	    function onActiveButtonChange(message) {
	        var container = message.container;
	        var buttons = Array.prototype.slice.call(container.childNodes);
	        buttons.forEach(function (button) {
	            if (button === message.button) {
	                button.className = 'punch active';
	            } else {
	                button.className = 'punch';
	            }
	        });
	    }
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Generic Publisher/Subscriber
	 * @module common/eventEmitter
	 */
	module.exports = function () {
	
	    /**
	     * Map to hold topics and related listeners.
	     * @private
	     * @type {object}
	     */
	    var topics = {};
	
	    return {
	        /**
	         * Registers a listener to specific topic
	         * @param {string} topic - uid of topic
	         * @param {function} listener - function to be executed when topic event triggered
	         * @returns {function} - a function for unsubscribing listener
	         */
	        on: function (topic, listener) {
	
	            //check if such topic exists and add one
	            if (!topics.hasOwnProperty(topic)) {
	                topics[topic] = [];
	            }
	
	            //Add listener to queue
	            var index = topics[topic].push(listener) - 1;
	
	            //return subscriber function
	            return (function () {
	                var executed = false;
	                return function () {
	                    if (!executed) {
	                        topics[topic].splice(index);
	                    }
	                }
	            })();
	        },
	
	        /**
	         * Emit event on specific topic with specified message
	         * @param {string} topic - uid of topic
	         * @param {object} message - message to be passed as param to all registered listeners
	         */
	        emit: function (topic, message) {
	            if (topics[topic]) {
	                topics[topic].forEach(function (listener) {
	                    listener(message);
	                });
	            }
	        }
	    }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDRlN2Q3MjU2NDM1YWI2ZjZhYzUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZGVsL3BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kZWwvcm91bmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3ZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvbW1vbi9ldmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQyxJOzs7Ozs7QUNmRDs7QUFFQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLFlBQVcsU0FBUztBQUNwQixZQUFXLFNBQVM7QUFDcEIsWUFBVyxhQUFhO0FBQ3hCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFB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ImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDA0ZTdkNzI1NjQzNWFiNmY2YWM1XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBldmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL2NvbW1vbi9ldmVudEVtaXR0ZXIuanMnKSgpO1xuICAgIHZhciBHYW1lID0gcmVxdWlyZSgnLi9nYW1lLmpzJyk7XG4gICAgdmFyIFBsYXllciA9IHJlcXVpcmUoJy4vbW9kZWwvcGxheWVyLmpzJyk7XG4gICAgdmFyIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcuanMnKTtcblxuICAgIC8vaW5pdGlhbGl6ZSBnYW1lIGdlc3R1cmVzIGFuZCBwbGF5ZXJzXG4gICAgdmFyIGdlc3R1cmVzID0gWydyb2NrJywgJ3BhcGVyJywgJ3NjaXNzb3JzJ107XG4gICAgdmFyIHBsYXllcnMgPSBbUGxheWVyKCdGb28nLCB0cnVlKSwgUGxheWVyKCdDb21wdXRlcicpXTtcbiAgICB2YXIgY291bnRzID0gWydSbyEnLCAnU2hhbSEnLCAnQm8hISEnXTtcblxuICAgIEdhbWUocGxheWVycywgZ2VzdHVyZXMsIGNvdW50cywgZXZlbnRFbWl0dGVyKTtcbiAgICBWaWV3KHBsYXllcnMsIGdlc3R1cmVzLCBldmVudEVtaXR0ZXIpO1xufSkoKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL21haW4uanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogR2VuZXJpYyBnYW1lIGNsYXNzXG4gKiBAcGFyYW0ge1BsYXllcltdfSBwbGF5ZXJzIC0gYSBjb2xsZWN0aW9uIG9mIHBsYXllcnMgcGFydGljaXBhbnRzIHRvIHRoZSBnYW1lLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gZ2VzdHVyZXMgLSBhIGNvbGxlY3Rpb24gb2YgZ2VzdHVyZXMgcGxheWVycyBjYW4gY2hvb3NlLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gY291bnRzIC0gYSBjb2xsZWN0aW9uIG9mIHN0cmluZyBmb3IgY291bnRpbmcgaW4gZ2FtZSBFeDogWydSbyEnLCAnU2hhbSEnLCAnQm8hISEnXS5cbiAqIEBwYXJhbSB7RXZlbnRFbWl0dGVyfSBldmVudEVtaXR0ZXIgLSBhIGV2ZW50IHN5c3RlbSB1c2VkIGZvciBpbnRlcmNvbXBvbmVudCBjb21tdW5pY2F0aW9uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBsYXllcnMsIGdlc3R1cmVzLCBjb3VudHMsIGV2ZW50RW1pdHRlcikge1xuXG4gICAgdmFyIFJvdW5kID0gcmVxdWlyZSgnLi9tb2RlbC9yb3VuZC5qcycpO1xuXG4gICAgLyoqXG4gICAgICogQSByZWZlcmVuY2UgdG8gY3VycmVudCBnYW1lIHJvdW5kLlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge1JvdW5kfVxuICAgICAqL1xuICAgIHZhciByb3VuZDtcblxuICAgIC8vc3Vic2NyaWJlIHRvIHBsYXllciBnZXN0dXJlIGFjdGlvbnNcbiAgICBldmVudEVtaXR0ZXIub24oJ2dlc3R1cmVDaGFuZ2UnLCBvbkdlc3R1cmVDaGFuZ2UpO1xuXG4gICAgLyoqXG4gICAgICogIFJvdW5kIGtpY2tzdGFydGVyLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RhcnQoKSB7XG5cbiAgICAgICAgLy9zZWxlY3QgcmFuZG9tIGdlc3R1cmUgZm9yIGJvdHNcbiAgICAgICAgcGxheWVycy5maWx0ZXIoZnVuY3Rpb24gKHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuICFwbGF5ZXIuaXNIdW1hbigpO1xuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIHZhciByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdlc3R1cmVzLmxlbmd0aCk7XG4gICAgICAgICAgICBwbGF5ZXIuc2V0R2VzdHVyZShnZXN0dXJlc1tyYW5kb21JbmRleF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL3NlbmQgb3V0IGV2ZW50IHRvIGluZm9ybSBjb21wb25lbnRzIHRvIGxvY2sgdXNlcnMgY2hvaWNlLlxuICAgICAgICBldmVudEVtaXR0ZXIuZW1pdCgnY291bnRkb3duU3RhcnQnKTtcblxuICAgICAgICByb3VuZCA9IFJvdW5kKHBsYXllcnMsIGdlc3R1cmVzLCBldmVudEVtaXR0ZXIpO1xuXG4gICAgICAgIC8vY291bnRkb3duIHByb3ZpZGVkIHdvcmRzXG4gICAgICAgIGNvdW50KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV2ZW50RW1pdHRlci5lbWl0KCdzY29yZScsIHJvdW5kLnNjb3JlKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb3VudGRvd24gZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2IgLSBjYWxsZWQgd2hlbiBjb3VudGRvd24gZmluaXNoZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY291bnQoY2IpIHtcbiAgICAgICAgY291bnRzLmZvckVhY2goZnVuY3Rpb24gKGNvdW50LCBpbmRleCkge1xuICAgICAgICAgICAgKGZ1bmN0aW9uIChjb3VudCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudEVtaXR0ZXIuZW1pdCgnY291bnRkb3duJywgY291bnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gY291bnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBpbmRleCAqIDEwMDApO1xuICAgICAgICAgICAgfSkoY291bnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVyIG9mIHBsYXllcnMgZ2VzdHVyZSBhY3Rpb25zXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1lc3NhZ2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvbkdlc3R1cmVDaGFuZ2UobWVzc2FnZSkge1xuXG4gICAgICAgIC8va2lja3N0YXJ0IG5leHQgcm91bmQgaWYgbm9uZSBvciBjdXJyZW50IGZpbmlzaGVkLlxuICAgICAgICBpZiAoIXJvdW5kIHx8IHJvdW5kLmlzU2NvcmVkKCkpIHtcbiAgICAgICAgICAgIHN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2FwcGx5IHBsYXllciBzZWxlY3Rpb25cbiAgICAgICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgPT09IG1lc3NhZ2UucGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnNldEdlc3R1cmUobWVzc2FnZS5nZXN0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2dhbWUuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUGxheWVyIGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHBsYXllciBuYW1lXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzSHVtYW4gLSBpcyBwbGF5ZXIgaHVtYW4gb3IgYm90XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUsIGlzSHVtYW4pIHtcblxuICAgIHZhciBnZXN0dXJlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBsYXllciBuYW1lIGdldHRlci5cbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldE5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQbGF5ZXIgZ2VzdHVyZSBzZXR0ZXJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5ld0dlc3R1cmUgLSBuZXcgcGxheWVyIGdlc3R1cmUgdG8gcGxheSB3aXRoXG4gICAgICAgICAqL1xuICAgICAgICBzZXRHZXN0dXJlOiBmdW5jdGlvbiAobmV3R2VzdHVyZSkge1xuICAgICAgICAgICAgZ2VzdHVyZSA9IG5ld0dlc3R1cmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBsYXllciBnZXN0dXJlIGdldHRlclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0R2VzdHVyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdlc3R1cmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBsYXllciBodW1hbiBvciBib3QgZmxhZyBnZXR0ZXJcbiAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBpc0h1bWFuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNIdW1hbjtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9tb2RlbC9wbGF5ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIFJvdW5kIGNsYXNzLiBSZXByZXNlbnRzIGEgcm91bmQgaW4gYSBnYW1lLlxuICogQHBhcmFtIHtQbGF5ZXJbXX0gcGxheWVycyAtIGEgY29sbGVjdGlvbiBvZiBwbGF5ZXJzIHBhcnRpY2lwYW50cyB0byB0aGUgZ2FtZS5cbiAqIEBwYXJhbSB7c3RyaW5nW119IGdlc3R1cmVzIC0gYSBjb2xsZWN0aW9uIG9mIGdlc3R1cmVzIHBsYXllcnMgY2FuIGNob29zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGxheWVycywgZ2VzdHVyZXMpIHtcblxuICAgIC8qKlxuICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IHJvdW5kIGlzIGZpbmlzaGVkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdmFyIHNjb3JlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmRzIG91dCB3aW5uZXIgb2YgdGhlIHJvdW5kLiBXaGVuIHVuZGVmaW5lZCAtIHRoZXJlIGlzIG5vIHdpbm5lciBpdCB0aGlzIHJvdW5kLlxuICAgICAgICAgKiBAcmV0dXJucyB7UGxheWVyfHVuZGVmaW5lZH1cbiAgICAgICAgICovXG4gICAgICAgIHNjb3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzY29yZWQgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIHdpbm5lcnMgPSBwbGF5ZXJzLmZpbHRlcihpc1dpbm5lcik7XG4gICAgICAgICAgICByZXR1cm4gd2lubmVyc1swXTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB3aGV0aGVyIHRoaXMgcm91bmQgaXMgZmluaXNoZWQgb3Igbm90LlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGlzU2NvcmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NvcmVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHByZWRpY2F0ZSB3aGljaCBjb21wYXJlcyBwcm92aWRlZCBwbGF5ZXIgdG8gb3RoZXIsXG4gICAgICogdG8gZmluZCBvdXQgd2lubmVyIG9mIHRoZSByb3VuZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7UGxheWVyfSBwbGF5ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1dpbm5lcihwbGF5ZXIsIGluZGV4KSB7XG5cbiAgICAgICAgdmFyIHBvc2l0aW9ucyA9IHBsYXllcnMubWFwKGdldEdlc3R1cmVQb3NpdGlvbik7XG5cbiAgICAgICAgdmFyIGN1cnJlbnRQb3NpdGlvbiA9IHBvc2l0aW9uc1twbGF5ZXJzLmluZGV4T2YocGxheWVyKV07XG5cbiAgICAgICAgcmV0dXJuIHBvc2l0aW9ucy5ldmVyeShmdW5jdGlvbiAocG9zaXRpb24sIG5leHRJbmRleCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBuZXh0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzR3JlYXRlcihjdXJyZW50UG9zaXRpb24sIHBvc2l0aW9uKSA9PT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gcHJlZGljYXRlIHRvIGZpbmQgd2lubmluZyBwbGF5ZXIuXG4gICAgICogVXNlcyBhbiBhbGdvcml0aG0gb2YgcGFyaXR5IG9mIGNob2ljZXMuXG4gICAgICogSWYgaXQgaXMgdGhlIHNhbWUgKHR3byBvZGQtbnVtYmVyZWQgbW92ZXMgb3IgdHdvIGV2ZW4tbnVtYmVyZWQgb25lcykgdGhlbiB0aGUgbG93ZXIgbnVtYmVyIHdpbnMsXG4gICAgICogd2hpbGUgaWYgdGhleSBhcmUgZGlmZmVyZW50IChvbmUgb2RkIGFuZCBvbmUgZXZlbikgdGhlIGhpZ2hlciB3aW5zLlxuICAgICAqIFJlbGllcyBvbiBwcm92aWRlZCBvcmRlciBvZiBnZXN0dXJlcy5cbiAgICAgKiBUaGlzIGFsZ29yaXRobSB3b3JrcyBvbmx5IHdpdGggYmFsYW5jZWQgZ2FtZXMuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBwb3NpdGlvbiBvZiBnZXN0dXJlIHBsYXllciBieSBwbGF5ZXIgeFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gcG9zaXRpb24gb2YgZ2VzdHVyZSBwbGF5ZXIgYnkgcGxheWVyIHlcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuXG4gICAgLy9UT0RPIEFkZCBwb3NzaWJpbGl0eSB0byBwbGF5IHVuYmFsYW5jZWQgZ2FtZXMsIGV4OiBhIHN0cmF0ZWd5IHBhdHRlcm4uXG4gICAgLy9UT0RPIFVuYmFsYW5jZWQgZ2FtZSBhbGdvcml0aG0gY2FuIHJlbHkgb24gR3JhcGggb2JqZWN0cyB3aXRoIHZlcnRpY2VzIGFzIGdlc3R1cmVzIGFuZCBkaXJlY3RlZCBlZGdlcyBhcyByZWxhdGlvbnMuXG4gICAgZnVuY3Rpb24gaXNHcmVhdGVyKHgsIHkpIHtcblxuICAgICAgICBpZiAoeCA9PT0geSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2FtZVBhcml0eSh4LCB5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHggPCB5ID8gMSA6IC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHggPiB5ID8gMSA6IC0xO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R2VzdHVyZVBvc2l0aW9uKHBsYXllcikge1xuICAgICAgICByZXR1cm4gZ2VzdHVyZXMuaW5kZXhPZihwbGF5ZXIuZ2V0R2VzdHVyZSgpKSArIDE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2FtZVBhcml0eShudW0xLCBudW0yKSB7XG4gICAgICAgIHJldHVybiAobnVtMSAmIDEpID09PSAobnVtMiAmIDEpO1xuICAgIH1cblxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL21vZGVsL3JvdW5kLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGxheWVycywgZ2VzdHVyZXMsIGV2ZW50RW1pdHRlcikge1xuXG4gICAgLy9oYW5kbGVyc1xuICAgIGV2ZW50RW1pdHRlci5vbignYWN0aXZlQnV0dG9uQ2hhbmdlJywgb25BY3RpdmVCdXR0b25DaGFuZ2UpO1xuXG4gICAgdmFyIGluZm9BcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaW5mb0FyZWEuY2xhc3NOYW1lID0gJ2luZm8tYXJlYSc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbmZvQXJlYSk7XG5cbiAgICB2YXIgY29udGFpbmVycyA9IHBsYXllcnNcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHBsYXllcikge1xuICAgICAgICAgIHJldHVybiBwbGF5ZXIuaXNIdW1hbigpO1xuICAgICAgfSlcbiAgICAgIC5tYXAoZnVuY3Rpb24gKHBsYXllcikge1xuICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBnZXN0dXJlcy5mb3JFYWNoKGZ1bmN0aW9uIChnZXN0dXJlKSB7XG4gICAgICAgICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdwdW5jaCc7XG4gICAgICAgICAgICAgIGJ1dHRvbi5pbm5lclRleHQgPSBnZXN0dXJlO1xuICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uIChwbGF5ZXIsIGdlc3R1cmUpIHtcbiAgICAgICAgICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIGV2ZW50RW1pdHRlci5lbWl0KCdnZXN0dXJlQ2hhbmdlJywge3BsYXllcjogcGxheWVyLCBnZXN0dXJlOiBnZXN0dXJlfSk7XG4gICAgICAgICAgICAgICAgICAgICAgZXZlbnRFbWl0dGVyLmVtaXQoJ2FjdGl2ZUJ1dHRvbkNoYW5nZScsIHtjb250YWluZXI6IGNvbnRhaW5lciwgYnV0dG9uOiBidXR0b259KTtcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0pKHBsYXllciwgZ2VzdHVyZSlcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICB9KTtcblxuICAgIC8vYXBwZW5kIGJ1dHRvbiBncm91cHNcbiAgICBjb250YWluZXJzLmZvckVhY2goZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgfSk7XG5cbiAgICBldmVudEVtaXR0ZXIub24oJ2NvdW50ZG93bicsIGZ1bmN0aW9uIChjb3VudCkge1xuICAgICAgICBpbmZvQXJlYS5pbm5lclRleHQgPSBjb3VudDtcbiAgICB9KTtcblxuICAgIGV2ZW50RW1pdHRlci5vbignc2NvcmUnLCBmdW5jdGlvbiAod2lubmVyKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5mb0FyZWEuaW5uZXJUZXh0ID0gd2lubmVyID8gd2lubmVyLmdldE5hbWUoKSArIFwiIFdpbnMhISFcIiA6ICdUSUUnO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBlbmFibGVCdXR0b25zKCk7XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9KTtcblxuICAgIGV2ZW50RW1pdHRlci5vbignY291bnRkb3duU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRhaW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGNvbnRhaW5lci5jaGlsZE5vZGVzKTtcbiAgICAgICAgICAgIGJ1dHRvbnMuZm9yRWFjaChmdW5jdGlvbiAoYnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vVE9ETyBub3QgRFJZISEhXG4gICAgZnVuY3Rpb24gZW5hYmxlQnV0dG9ucygpIHtcbiAgICAgICAgY29udGFpbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgICAgICAgICAgIHZhciBidXR0b25zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoY29udGFpbmVyLmNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgYnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICAgICAgICAgICAgICBidXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkFjdGl2ZUJ1dHRvbkNoYW5nZShtZXNzYWdlKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBtZXNzYWdlLmNvbnRhaW5lcjtcbiAgICAgICAgdmFyIGJ1dHRvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChjb250YWluZXIuY2hpbGROb2Rlcyk7XG4gICAgICAgIGJ1dHRvbnMuZm9yRWFjaChmdW5jdGlvbiAoYnV0dG9uKSB7XG4gICAgICAgICAgICBpZiAoYnV0dG9uID09PSBtZXNzYWdlLmJ1dHRvbikge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAncHVuY2ggYWN0aXZlJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdwdW5jaCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3ZpZXcuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogR2VuZXJpYyBQdWJsaXNoZXIvU3Vic2NyaWJlclxuICogQG1vZHVsZSBjb21tb24vZXZlbnRFbWl0dGVyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLyoqXG4gICAgICogTWFwIHRvIGhvbGQgdG9waWNzIGFuZCByZWxhdGVkIGxpc3RlbmVycy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICovXG4gICAgdmFyIHRvcGljcyA9IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZ2lzdGVycyBhIGxpc3RlbmVyIHRvIHNwZWNpZmljIHRvcGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIHVpZCBvZiB0b3BpY1xuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdG9waWMgZXZlbnQgdHJpZ2dlcmVkXG4gICAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbn0gLSBhIGZ1bmN0aW9uIGZvciB1bnN1YnNjcmliaW5nIGxpc3RlbmVyXG4gICAgICAgICAqL1xuICAgICAgICBvbjogZnVuY3Rpb24gKHRvcGljLCBsaXN0ZW5lcikge1xuXG4gICAgICAgICAgICAvL2NoZWNrIGlmIHN1Y2ggdG9waWMgZXhpc3RzIGFuZCBhZGQgb25lXG4gICAgICAgICAgICBpZiAoIXRvcGljcy5oYXNPd25Qcm9wZXJ0eSh0b3BpYykpIHtcbiAgICAgICAgICAgICAgICB0b3BpY3NbdG9waWNdID0gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQWRkIGxpc3RlbmVyIHRvIHF1ZXVlXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0b3BpY3NbdG9waWNdLnB1c2gobGlzdGVuZXIpIC0gMTtcblxuICAgICAgICAgICAgLy9yZXR1cm4gc3Vic2NyaWJlciBmdW5jdGlvblxuICAgICAgICAgICAgcmV0dXJuIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4ZWN1dGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFleGVjdXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9waWNzW3RvcGljXS5zcGxpY2UoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRW1pdCBldmVudCBvbiBzcGVjaWZpYyB0b3BpYyB3aXRoIHNwZWNpZmllZCBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIHVpZCBvZiB0b3BpY1xuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWVzc2FnZSAtIG1lc3NhZ2UgdG8gYmUgcGFzc2VkIGFzIHBhcmFtIHRvIGFsbCByZWdpc3RlcmVkIGxpc3RlbmVyc1xuICAgICAgICAgKi9cbiAgICAgICAgZW1pdDogZnVuY3Rpb24gKHRvcGljLCBtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodG9waWNzW3RvcGljXSkge1xuICAgICAgICAgICAgICAgIHRvcGljc1t0b3BpY10uZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY29tbW9uL2V2ZW50RW1pdHRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=