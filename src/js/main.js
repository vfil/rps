'use strict';

var reducer = require('./reducer.js');
var Player = require('./domain/player.js');
var Store = require('./common/store.js');
var renderFunc = require('./render.js');
var delayedExecutor = require('./delayedExecutor.js');
var Judge = require('./domain/judge.js');
var LogStore = require('./domain/logStore.js');
var GuessStrategy = require('./domain/guessStrategy.js');
var RPS = require('./rps.js');
//TODO create a backlog from todos.
//TODO README.md
//TODO a game a has an over.
//TODO show hints only first times.
//TODO prompt for a new game start before reload.
//TODO consider evolution to a network p2p game.
//TODO win the game when one of players gets 100 score.
// TODO manage unsupported devices.
(function() {
    var store = Store(reducer, {});
    //TODO multiple player profiles, creation/config/scoring/sharing.
    var players = [
        Player('Computer'),
        Player('You', true)
    ];
    RPS(players, store, renderFunc, delayedExecutor, Judge(), GuessStrategy(), LogStore());
})();
