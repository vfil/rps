'use strict';

var VGame = require('./components/VGame.js');
var VDOM = require('./common/vdom/VDOM.js');

/**
 * Flag to indicate whether document level events are handled.
 * @private
 * @type {boolean}
 */
var eventsHandlersAttached = false;

/**
 * Turns state into DOM view representation.
 * @module render
 * @param {object} state - current application state.
 * @param {object} handlers - key value map of handles for user events.
 */
module.exports = function (state, handlers) {
    //attach needed high level events
    if (!eventsHandlersAttached) {
        eventsHandlersAttached = true;
        bindHighLevelEvents(handlers);
    }
    var props = stateToProps(state);
    //copy handlers to view props
    for (var key in handlers) {
        if (handlers.hasOwnProperty(key)) {
            props[key] = handlers[key]
        }
    }
    //instantiate main view component
    var gameComponent = VGame(props);
    //insert/update DOM based on provided props.
    VDOM.render(gameComponent, document.getElementById('app'));
};

/**
 * Computes properties needed for view from state.
 * @private
 * @param {object} state - current state.
 * @returns {object}
 */
//TODO improve performance with memoization where needed
function stateToProps(state) {
    var panes = splitPlayers(state.players);
    return {
        counting: state.counting,
        gestures: state.gestures,
        leftPane: panes[0],
        rightPane: panes[1],
        info: computeInfo(state),
        logs: state.logs
    }
}

/**
 * Split player list from state to to panels.
 * @private
 * @param {Player[]} players
 * @returns {Array.<Player[]>}
 */
function splitPlayers(players) {
    return players.reduce(function (acc, nextPlayer, index) {
        var paneIndex = index % 2;
        acc[paneIndex].push({
            name: nextPlayer.getName(),
            gesture: nextPlayer.getGesture(),
            wins: nextPlayer.getWins(),
            isHuman: nextPlayer.isHuman()
        });
        return acc;
    }, [[], []]);
}

function computeInfo(state) {
    if (state.scored) {
        return state.winner ? (state.winner.isHuman() ? 'You win!' : 'You lost!') : 'TIE!';
    } else if (state.counting) {
        return state.count;
    }

    return 'Choose your punch! Feeling lucky? Hit enter or space!';
}

function bindHighLevelEvents(handlers) {
    //shortcut keys
    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.preventDefault();
            handlers.chooseRandomGesture();
        }
    });
}
