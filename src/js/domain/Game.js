'use strict';

var Store = require('../common/store.js');
var Round = require('./Round.js');
var Player = require('./Player.js');
var Actions = require('../common/actions.js');

/**
 * Generic game class
 * @param {Player[]} players - a collection of players participants to the game.
 * @param {string[]} gestures - a collection of gestures players can choose.
 * @param {string[]} counts - a collection of string for counting in game Ex: ['Ro!', 'Sham!', 'Bo!!!'].
 */
//TODO Game is mixed object not domain, separate domain logic!!!
module.exports = function (players, gestures, counts, countInterval) {

    var countInterval = countInterval || 1000;

    //split player in two panes
    //TODO maybe this is only view logic???
    var playerPanes = splitPlayers(players);

    var initialState = {
        gestures: gestures,
        leftPane: playerPanes[0],
        rightPane: playerPanes[1],
        counts: counts,
        info: 'Choose your punch!!!',
        logs: []
    };

    var reducer = function (state, action) {
        switch (action.type) {
            case Actions.types.GESTURE_CHANGE:
                return gestureChange(state, action);
                break;
            case Actions.types.COUNTDOWN:
                return nextCount(state, action);
                break;
            case Actions.types.SCORE:
                return score(state, action);
                break;
            case Actions.types.ADD_BOT:
                return addBot(state, action);
                break;
            case Actions.types.REMOVE_BOT:
                return removeBot(state, action);
                break;

            default:
                return state;
        }
    };

    var store = Store(reducer, initialState);

    /**
     * A reference to current game round.
     * @private
     * @type {Round}
     */
    var round;

    return {
        getState: function () {
            return store.getState();
        },
        subscribe: function (listener) {
            return store.subscribe(listener);
        },
        //TODO too hard to test
        setGesture: function (player, gesture) {
            //TODO should gesture be validated???
            store.dispatch(Actions.gestureChange(player, gesture));
            //TODO prefer not splitting changes to state between setters and reducer.
            //TODO at later time we can implement undo and history navigate features.
            if (!round || round.isScored()) {
                start();
            }
        },

        addBot: function () {
            store.dispatch(Actions.addBot());
        },

        removeBot: function () {
            store.dispatch(Actions.removeBot());
        }
    };

    /**
     *  Round kickstarter.
     * @private
     */
    function start() {

        //select random gesture for bots
        //TODO predict player gesture based on previous selected gestures
        players.filter(function (player) {
            return !player.isHuman();
        }).forEach(function (player) {
            var randomIndex = Math.floor(Math.random() * gestures.length);
            player.setGesture(gestures[randomIndex]);
        });

        round = Round(players, gestures);

        //countdown provided words
        count(function () {
            var winner = round.score();
            store.dispatch(Actions.score(winner));
        });
    }

    /**
     * Countdown function.
     * @param {function} cb - called when countdown finished.
     */
    function count(cb) {
        counts.forEach(function (count, index) {
            setTimeout(function () {
                store.dispatch(Actions.countdown(count));
                if (index == counts.length - 1) {
                    setTimeout(cb, countInterval);
                }
            }, index * countInterval);
        });
    }

    /**
     * Reducer of players gesture actions
     * @param {object} action
     */
    function gestureChange(state, action) {
        //apply player selection
        //TODO immutable???
        action.player.setGesture(action.gesture);
        return state;
    }

    function nextCount(state, action) {
        state.info = action.count;
        return state;
    }

    function score(state, action) {
        //TODO probably a view concern not domain.
        state.info = action.winner ? action.winner.getName() + ' wins !!!' : 'TIE!!!';
        var log = players.map(function (player) {
            return {
                name: player.getName(),
                gesture: player.getGesture(),
                isWinner: player === action.winner,
                isTie: !action.winner
            }
        });
        state.logs.unshift(log);
        return state;
    }

    function addBot(state, action) {
        var bot = Player('Computer' + players.length);
        players.push(bot);
        redistributePlayers(state);
        return state;
    }

    function removeBot(state, action) {
        //TODO we can't just remove all players!!!
        players.pop();
        redistributePlayers(state);
        return state;
    }

    function redistributePlayers(state) {
        var playerPanes = splitPlayers(players);
        state.leftPane = playerPanes[0];
        state.rightPane = playerPanes[1];
        return state;
    }

    //split player in two panes
    //TODO this smells like view spirit
    function splitPlayers(players) {
        return players.reduce(function (acc, next, index) {
            var pane = index % 2;
            acc[pane].push(next);
            return acc;
        }, [[], []]);
    }
};