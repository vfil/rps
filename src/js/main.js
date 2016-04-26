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

//TODO consider evolution to a network p2p game.
(function() {
    var store = Store(reducer, {});
    var players = [
        //TODO multiple player profiles.
        Player('You', true),
        Player('Computer')
    ];
    RPS(players, store, renderFunc, delayedExecutor, Judge(), GuessStrategy(), LogStore());
})();
