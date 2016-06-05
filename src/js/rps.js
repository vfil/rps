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
 * @param {function} delayedExecutor - Function helper to execute function at specified timeout.
 * @param {Judge} judge
 * @param {GuessStrategy} guessStrategy
 * @param {LogStore} logStore
 * @returns {object}
 */
module.exports = function (
    players,
    store,
    renderFunc,
    delayedExecutor,
    judge,
    guessStrategy,
    logStore,
    countInterval
) {
    //initialize game gestures and players
    var gestures = ['rock', 'paper', 'scissors'];
    var extendedGestures = ['rock', 'paper', 'scissors', 'spock', 'lizard'];
    var counts = ['Ro!', 'Sham!', 'Bo!'];
    //countdown interval before announcing winner
    countInterval = countInterval || 600;

    //instantiate our game domain object
    var game = Game();

    //subscribe render function to state changes
    store.subscribe(render);

    //GameController exposed interface.
    var handlers = {
        changeGesture: changeGesture,
        chooseRandomGesture: chooseRandomGesture,
        addBot: addBot,
        removeBot: removeBot
    };

    //kick off by initializing state
    store.dispatch(Actions.initState(getInitialState(players, gestures)));

    return handlers;

    /**
     * Changes gesture for provided player.
     * Will start round counting if not already started.
     * Gesture change is not affected by round state, so anyway player will have gesture changed.
     * @public
     * @param {string} playerName
     * @param {string} gesture
     */
    function changeGesture(playerName, gesture) {
        var state = store.getState();
        //check if a new game should be started
        if(state.ended) {
            store.dispatch(Actions.resetPlayersWins());
            store.dispatch(Actions.initState(getInitialState(state.players, state.gestures)));
        }

        //dispatch gesture change
        store.dispatch(Actions.gestureChange(playerName, gesture));

        //start round counting if needed, as gesture change serves a signal to start it.
        if (!store.getState().counting) {
            setBotsGestures();
            count();
        }
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
     * Chooses a random gesture for player, will aviod setting the same gesture twice
     * as most probably this is not users intention.
     * @public
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
        var gesture = guessStrategy.random(gestures);
        changeGesture(player.getName(), gesture);
    }

    /**
     * Chooses gestures for bots.
     * @private
     */
    function setBotsGestures() {
        var gestures = store.getState().gestures;
        var players = store.getState().players;
        var bots = players.filter(function (player) {
            return !player.isHuman();
        });
        var humans = players.filter(function (player) {
            return player.isHuman();
        });

        if(bots.length === 1 && humans.length === 1) {
            //in this case we can try to guess
            var human = humans[0];
            var bot = bots[0];
            var gesture = guessStrategy.guess(human.getName(), logStore, gestures, judge);
            store.dispatch(Actions.gestureChange(bot.getName(), gesture));
        } else {
            //guesses in this case make no sense
            //we pick random gestures for each bot
            bots.forEach(function (player) {
                var gesture = guessStrategy.random(gestures);
                store.dispatch(Actions.gestureChange(player.getName(), gesture));
            });
        }
    }

    /**
     * Scores the round. Called after countdown is finished.
     * @private
     */
    function announceWinner() {
        var state = store.getState();
        game.startRound(state.players, state.gestures);
        var winner = game.score(judge);
        store.dispatch(Actions.score(winner));
        recordGestures(state.players);

        winner = store.getState().winner;
        if(winner && winner.getWins() === 3) {
            winner.incrementGameWins();
            store.dispatch(Actions.gameEnd(winner));
        }

        delayedExecutor(resetGestures, countInterval);
    }

    /**
     * Resets gestures for all players, usually called at the end of the round.
     * @private
     */
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
        store.dispatch(Actions.countdownStart());
        counts.forEach(function (count, index) {
            delayedExecutor(countOnce, countInterval * index, [count]);
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

    /**
     * Records gestures for guessing
     * @private
     * @param {Player[]} players
     */
    function recordGestures(players) {
        players.forEach(function (player) {
            logStore.record(player.getName(), player.getGesture());
        });
    }

    /**
     * Gets initial state of the game
     * @private
     */
    function getInitialState(players, gestures) {
        return {
            players: players,
            gestures: gestures,
            counting: false,
            count: null,
            winner: null,
            scored: false,
            ended: false,
            logs: []
        };
    }

    /**
     * Render function subscribed to state changes.
     * @private
     */
    function render() {
        //TODO just for fun try nodejs console game view
        //update our injected view
        renderFunc(store.getState(), handlers);
    }
};
