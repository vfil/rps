'use strict';

var Round = require('./model/round.js');

/**
 * Generic game class
 * @param {Player[]} players - a collection of players participants to the game.
 * @param {string[]} gestures - a collection of gestures players can choose.
 * @param {string[]} counts - a collection of string for counting in game Ex: ['Ro!', 'Sham!', 'Bo!!!'].
 * @param {EventEmitter} eventEmitter - a event system used for intercomponent communication
 */
module.exports = function (players, gestures, counts, eventEmitter) {

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
            setTimeout(function () {
                eventEmitter.emit('countdown', count);
                if (index == counts.length - 1) {
                    cb();
                }
            }, index * 1000);
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