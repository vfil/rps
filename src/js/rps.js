'use strict';

var Game = require('./domain/game.js');
var Player = require('./domain/player.js');
var Actions = require('./actions.js');

/**
 * Main Application Controller.
 * @module GameController
 * @param {Player[]} players - Array of players for the game.
 * @param {Store} store - Store instance.
 * @param {function} renderFunc - Function to receive state on each update.
 *  @param {function} delayedExecutor - Function helper to execute function at specified timeout.
 * @returns {object}
 */
module.exports = function (players, store, renderFunc, delayedExecutor) {
    //initialize game gestures and players
    var gestures = ['rock', 'paper', 'scissors'];
    var extendedGestures = ['rock', 'paper', 'scissors', 'spock', 'lizard'];
    var counts = ['Ro!', 'Sham!', 'Bo!'];
    //countdown interval before announcing winner
    var countInterval = 700;

    var initialState = {
        players: players,
        gestures: gestures,
        counting: false,
        count: null,
        winner: null,
        scored: false,
        logs: []
    };

    //instantiate our game domain object
    var game = Game();

    //subscribe render function to state changes
    store.subscribe(render);

    //GameController public interface.
    var handlers = {
        changeGesture: changeGesture,
        chooseRandomGesture: chooseRandomGesture,
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
        if (!store.getState().counting) {
            //countdown provided words
            count();
        }
    }

    /**
     * Chooses a random gesture for player, will aviod setting the same gesture twice
     * as most probably this is not users intention.
     */
    function chooseRandomGesture() {
        var filteredPlayers = store.getState().players.filter(function (player) {
            return player.isHuman() === true;
        });
        //by now there is only one human player
        var player = filteredPlayers[0];
        var gestures = store.getState().gestures.slice(0);
        //don't set same gesture
        var index = gestures.indexOf(player.getGesture());
        if (index !== -1) {
            gestures.splice(index, 1);
        }
        var randomIndex = Math.floor(Math.random() * gestures.length);
        changeGesture(player.getName(), gestures[randomIndex]);
    }

    /**
     * Ads a new bot to the game.
     * @public
     */
    function addBot() {
        var players = store.getState().players;
        if(players.length < 4) {
            var bot = Player('Computer' + store.getState().players.length);
            store.dispatch(Actions.addBot(bot));

            //update gestures as probability of tie increases drastically
            //get players again as probably they are not the same
            players = store.getState().players;
            if (players.length === 3) {
                store.dispatch(Actions.updateGestures(extendedGestures));
            }
        }
    }

    /**
     * Removes last added bot from the game.
     * @public
     */
    function removeBot() {
        var players = store.getState().players;
        if(players.length > 2) {
            store.dispatch(Actions.removeBot());

            //if 2 players left reduce as playing extended game doesn't make to much sense
            //unless user wants to, but this is special case
            players = store.getState().players;
            if (players.length === 2) {
                store.dispatch(Actions.updateGestures(gestures));
            }
        }
    }

    /**
     * Scores the round. Called after countdown is finished.
     * @private
     */
    function announceWinner() {
        var state = store.getState();
        game.startRound(state.players, state.gestures);
        var winner = game.score();
        if (winner) {
            winner.incrementWins();
        }
        store.dispatch(Actions.score(winner));
        delayedExecutor(resetGestures, countInterval);
    }

    function resetGestures() {
        var state = store.getState();
        if (state.scored) {
            store.dispatch(Actions.resetPlayersGestures());
        }
    }

    /**
     * Countdown function.
     * Also takes care of setting random gesture for bots and updating state.
     * @private
     */
    function count() {
        store.dispatch(Actions.setBotsGestures());
        store.dispatch(Actions.countdownStart());
        counts.forEach(function (count, index) {
            delayedExecutor(countOnce, countInterval * index, [count])
        });
        delayedExecutor(announceWinner, countInterval * counts.length);
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
