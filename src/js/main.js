'use strict';

//styles
require('../css/style.scss');
require('../css/imgs/favicon.ico');

var reducer = require('./reducer.js');
var Player = require('./domain/player.js');
var Store = require('./common/store.js');
var mapStateToProps = require('./mapStateToProps.js');
var renderFunc = require('./render.js');
var delayedExecutor = require('./delayedExecutor.js');
var Judge = require('./domain/judge.js');
var LogStore = require('./domain/logStore.js');
var GuessStrategy = require('./domain/guessStrategy.js');
var RPS = require('./rps.js');
//TODO consider evolution to a network p2p game.
//TODO manage unsupported devices.
(function() {
    var store = Store(reducer, {});
    //TODO multiple player profiles, creation/config/scoring/sharing.
    var players = [
        Player('Computer'),
        Player('You', true)
    ];
    var renderer = renderFunc(mapStateToProps);
    RPS(players, store, renderer, delayedExecutor, Judge(), GuessStrategy(), LogStore());
})();
