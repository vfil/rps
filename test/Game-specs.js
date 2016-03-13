'use strict';

var expect = require('chai').expect;

var EventEmitter = require('../src/js/common/eventEmitter.js');
var Game = require('../src/js/game.js');
var Player = require('../src/js/model/player.js');

describe('Game specs:', function () {

    var eventEmitter,
      game,
      players;
    var gestures = ['rock', 'paper', 'scissors'];
    var counts = ['Ro!', 'Sham!', 'Bo!!!'];

    beforeEach(function () {
        eventEmitter = EventEmitter();
        players = [Player('Foo'), Player('Computer')];
        game = Game(players, gestures, counts, eventEmitter);
    });

    it('should set a random gesture for bots', function () {
        var player = players[0];
        eventEmitter.emit('gestureChange', {player: player, gesture: 'rock'});

        players.forEach(function (player) {
            expect((gestures.indexOf(player.getGesture()) !== -1)).to.equals(true);
        })
    });

    it('should update accordingly gesture for player', function () {
        var player = players[0];
        eventEmitter.emit('gestureChange', {player: player, gesture: 'paper'});

        expect(player.getGesture()).to.equals('paper');
    });

    it('should emit countdownStart event', function (done) {
        var player = players[0];
        eventEmitter.on('countdownStart', function() {
            done();
        });
        eventEmitter.emit('gestureChange', {player: player, gesture: 'paper'});

    });

    it('should emit score event', function (done) {
        this.timeout(5000);
        eventEmitter.on('score', function(winner) {
            expect(winner).to.eql(player2);
            done();
        });

        var player1 = players[0];
        var player2 = players[1];
        eventEmitter.emit('gestureChange', {player: player1, gesture: 'paper'});
        eventEmitter.emit('gestureChange', {player: player2, gesture: 'scissors'});
    });
});