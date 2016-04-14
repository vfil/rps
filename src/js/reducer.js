'use strict';

var Actions = require('./actions.js');
/**
 * Function single point entry for mutation the state.
 * Action parameter object should should have a type property.
 * Throws an error if action is undefined, doesn't have type property
 * or action type property is not resolved to any state mutation function.
 * @param {object} state - current state.
 * @param {object} action - an object that describes change.
 */
module.exports = function (state, action) {
    if(!action || typeof action.type !== 'string') {
        throw new Error('Dispatched action is null/undefined or action.type is not a string');
    }
    switch (action.type) {
        case Actions.types.INIT_STATE:
            return initState(state, action);
        case Actions.types.GESTURE_CHANGE:
            return gestureChange(state, action);
        case Actions.types.SET_BOTS_GESTURE:
            return setBotsGesture(state, action);
        case Actions.types.COUNTDOWN_START:
            return countdownStart(state, action);
        case Actions.types.COUNTDOWN:
            return nextCount(state, action);
        case Actions.types.SCORE:
            return score(state, action);
        case Actions.types.ADD_BOT:
            return addBot(state, action);
        case Actions.types.REMOVE_BOT:
            return removeBot(state, action);
    }

    throw new Error('Reducer did not match a state mutation for' + action.type);
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
 * Sets random gestures for bots.
 * @private
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
function setBotsGesture(state, action) {
    //TODO try to predict player gesture based on previous selected gestures
    state.players.filter(function (player) {
        return !player.isHuman();
    }).forEach(function (player) {
        var randomIndex = Math.floor(Math.random() * state.gestures.length);
        player.setGesture(state.gestures[randomIndex]);
    });

    state.players = state.players.slice(0);
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
    state.info = action.count;
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
    //TODO view logic???
    state.info = action.winner ? action.winner.getName() + ' wins !!!' : 'TIE!!!';
    var log = state.players.map(function (player) {
        return {
            name: player.getName(),
            gesture: player.getGesture(),
            isWinner: player === action.winner
        }
    });
    state.logs.unshift(log);
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
    //TODO we can't just remove all players!!!
    //TODO mutable
    state.players.pop();
    return state;
}