'use strict';

var Game = require('./domain/game.js');
var Player = require('./domain/player.js');
var Actions = require('./actions.js');

/**
 * Main Application Controller.
 * @module GameController
 * @param {Store} store - Store instance.
 * @param {function} renderFunc - Function to receive state on each update.
 * @param {function} counterFunc - Function to handle round counting implementation details.
 * @returns {object}
 */
module.exports = function(store, renderFunc, counterFunc) {
    //initialize game gestures and players
    var gestures = ['rock', 'paper', 'scissors'];
    var players = [
        Player('Sandu', true),
        Player('Computer1')
    ];
    var counts = ['1!', '2!', '3!'];
    //countdown interval before announcing winner
    var countInterval = 1000;

    var initialState = {
        counting: false,
        players: players,
        gestures: gestures,
        info: 'Choose your punch!!!',
        logs: []
    };

    //instantiate our game domain object
    var game = Game();

    //subscribe render function to state changes
    store.subscribe(render);

    //GameController public interface.
    var handlers = {
        changeGesture: changeGesture,
        addBot: addBot,
        removeBot: removeBot
    };

    //kick off by initializing state
    store.dispatch(Actions.initState(initialState));

    return handlers;

    /**
     * Render function subscribed to state changes.
     * @private
     */
    function render() {
        //TODO just for fun try node js console game view
        //update our injected view
        renderFunc(store.getState(), handlers);
    }

    /**
     * Changes gesture for provided player.
     * Will start round counting if not already started.
     * Gesture change is not affected by round state, so anyway player will have gesture changed.
     * @public
     * @param {string} playerName
     * @param {string} gesture
     */
    function changeGesture(playerName, gesture) {
        store.dispatch(Actions.gestureChange(playerName, gesture));
        //start round counting if needed, as gesture change serves a signal to start it.
        if(!store.getState().counting) {
            //countdown provided words
            count();
        }
    }

    /**
     * Ads a new bot to the game.
     * @public
     */
    function addBot() {
        var bot = Player('Computer' + store.getState().players.length);
        store.dispatch(Actions.addBot(bot));
    }

    /**
     * Removes last added bot from the game.
     * @public
     */
    function removeBot() {
        store.dispatch(Actions.removeBot());
    }

    /**
     * Scores the round. Called after countdown is finished.
     * @private
     */
    function announceWinner() {
        var state = store.getState();
        game.startRound(state.players, state.gestures);
        var winner = game.score();
        store.dispatch(Actions.score(winner));
    }

    /**
     * Countdown function.
     * Also takes care of setting random gesture for bots and updating state.
     * @private
     */
    function count() {
        store.dispatch(Actions.setBotsGestures());
        store.dispatch(Actions.countdownStart());
        counterFunc(counts, countInterval, countOnce, announceWinner);
    }

    /**
     * Dispatches an countdown action.
     * @private
     * @param {string} count
     */
    function countOnce(count) {
        store.dispatch(Actions.countdown(count));
    }
};