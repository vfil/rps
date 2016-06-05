'use strict';

/**
 * Computes properties needed for view from state.
 * @module mapStateToProps
 * @param {object} state - current state.
 * @returns {object}
 */
module.exports = function (state) {
    var panes = splitPlayers(state.players);
    return {
        counting: state.counting,
        gestures: state.gestures,
        leftPane: panes[0],
        rightPane: panes[1],
        info: computeInfo(state),
        logs: state.logs
    };
};

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
            gameWins: nextPlayer.getGameWins(),
            isHuman: nextPlayer.isHuman()
        });
        return acc;
    }, [[], []]);
}

/**
 * Computes props for info pane.
 * @private
 * @param {object} state
 * @returns object
 */
function computeInfo(state) {
    var info = {};
    if (state.scored && !state.ended) {
        info.message = state.winner ? (state.winner.isHuman() ? 'You win!' : 'You lost!') : 'TIE!';
        info.hint = 'Choose throw!';
    } else if (state.ended) {
        info.message = state.winner.isHuman() ? 'You win the game!' : 'You lost the game!';
        info.hint = 'Choose throw to start a new game!';
    } else if (state.counting) {
        info.message = state.count;
        info.hint = '';
    } else {
        info.message = 'Choose throw!';
        info.hint = 'Feeling lucky? Hit enter or space!';
    }
    return info;
}
