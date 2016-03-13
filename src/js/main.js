'use strict';

(function () {
    var eventEmitter = require('./common/eventEmitter.js')();
    var Game = require('./game.js');
    var Player = require('./model/player.js');
    var View = require('./view.js');

    //initialize game gestures and players
    var gestures = ['rock', 'paper', 'scissors'];
    var players = [Player('Foo', true), Player('Computer')];
    var counts = ['Ro!', 'Sham!', 'Bo!!!'];

    Game(players, gestures, counts, eventEmitter);
    View(players, gestures, eventEmitter);
})();