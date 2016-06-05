'use strict';

var Actions = require('./actions.js');
/**
 * Single entry point for mutation the state.
 * Action parameter object should should have a type property.
 * Throws an error if action is undefined, doesn't have type property
 * or action type property is not resolved to any state mutation function.
 * @param {object} state - current state.
 * @param {object} action - an object that describes change.
 */
module.exports = function (state, action) {
    if (!action || typeof action.type !== 'string') {
        throw new Error('Dispatched action is null/undefined or action.type is not a string');
    }
    switch (action.type) {
        case Actions.types.INIT_STATE:
            return initState(state, action);
        case Actions.types.GESTURE_CHANGE:
            return gestureChange(state, action);
        case Actions.types.COUNTDOWN_START:
            return countdownStart(state, action);
        case Actions.types.COUNTDOWN:
            return nextCount(state, action);
        case Actions.types.SCORE:
            return score(state, action);
        case Actions.types.GAME_END:
            return gameEnd(state, action);
        case Actions.types.ADD_BOT:
            return addBot(state, action);
        case Actions.types.REMOVE_BOT:
            return removeBot(state, action);
        case Actions.types.UPDATE_GESTURES:
            return updateGestures(state, action);
        case Actions.types.RESET_PLAYERS_GESTURES:
            return resetPlayersGestures(state, action);
        case Actions.types.RESET_PLAYERS_WINS:
            return resetPlayersWins(state, action);
    }

    throw new Error('Reducer did not match a state mutation for ' + action.type);
};

/**
 * Replaces current state with a new state.
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function initState(state, action) {
    return action.state;
}

/**
 * Sets gesture for payer
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function gestureChange(state, action) {
    //find player
    var filteredPlayers = state.players.filter(function (player) {
        return player.getName() === action.playerName;
    });
    //validate result
    if (filteredPlayers.length !== 1) {
        throw new Error('Trying to set gesture on non existing player OR two players or more have the same name');
    } else {
        //set gesture
        var player = filteredPlayers[0];
        player.setGesture(action.gesture);
        //replace old players array with new array instance
        var players = state.players;
        var index = players.indexOf(player);
        var newPlayers = [].concat(players.slice(0, index), [player], players.slice(index + 1, players.length));
        state.players = newPlayers;
    }

    return state;
}

/**
 * Mark state with a flag to show that round count started.
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function countdownStart(state, action) {
    state.counting = true;
    state.scored = false;
    return state;
}

/**
 * Sets next counter to state.
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function nextCount(state, action) {
    state.count = action.count;
    return state;
}

/**
 * Updates state with round winner or tie and resets counting flag
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function score(state, action) {
    state.counting = false;
    state.scored = true;
    state.winner = action.winner;
    //compute current round log
    var log = state.players.map(function (player) {
        return {
            name: player.getName(),
            gesture: player.getGesture(),
            wins: player.getWins(),
            isWinner: player === state.winner
        };
    });
    state.logs.unshift(log);
    state.logs = state.logs.slice(0, 3);
    if(state.winner) {
        state.winner.incrementWins();
    }
    return state;
}

function gameEnd(state, action) {
    state.winner = action.winner;
    state.ended = true;
    return state;
}

/**
 * Adds provided bot to the end of player list.
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function addBot(state, action) {
    state.players = state.players.concat(action.player);
    return state;
}

/**
 * removes last player from list.
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function removeBot(state, action) {
    var players = state.players;
    state.players = players.slice(0, players.length - 1);
    return state;
}

/**
 * Updates gesture list.
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {*}
 */
function updateGestures(state, action) {
    state.gestures = action.gestures;
    return state;
}

/**
 * Resets all players gestures.
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {*}
 */
function resetPlayersGestures(state, action) {
    state.players = state.players.map(function (player) {
        player.resetGesture();
        return player;
    });
    return state;
}

/**
 * Resets all players wins.
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {*}
 */
function resetPlayersWins(state, action) {
    state.players = state.players.map(function (player) {
        player.resetWins();
        return player;
    });
    return state;
}
