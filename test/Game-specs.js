'use strict';
var expect = require('chai').expect;
var Game = require('../src/js/domain/Game.js');
var Player = require('../src/js/domain/Player.js');

describe('Game specs - 2 players:', function () {
    var game,
      players,
      gestures,
      counts;

    beforeEach(function () {
        gestures = ['rock', 'paper', 'scissors'];
        players = [
            Player('P0', true),
            Player('P1')
        ];
        counts = ['0', '1', '2'];
        //make test faster by decreasing count interval
        game = Game(players, gestures, counts, 100);
    });

    it('#getState should return initial state', function () {
        var expectedState = {
            gestures: gestures,
            leftPane: [players[0]],
            rightPane: [players[1]],
            counts: counts,
            info: 'Choose your punch!!!',
            logs: []
        };
        expect(game.getState()).to.eql(expectedState);
    });

    it('#subscribe should register listener to store state change', function (done) {
        function onStateChange() {
            done();
        }
        game.subscribe(onStateChange);
        var player = players[0];
        var gesture = gestures[0];
        game.setGesture(player, gesture);
    });

    it('#setGesture should set gesture to provided player', function() {
        //P0 is human type.
        var player = players[0];
        var gesture = gestures[0];
        game.setGesture(player, gesture);
        expect(player.getGesture()).to.equal(gesture);
    });

    it('#setGesture should trigger start of first round and set random gesture for bot players',function () {
        //P0 is human type.
        var player = players[0];
        var gesture = gestures[0];
        game.setGesture(player, gesture);
        var everyBotSetup = players.filter(function(player) {
            return !player.isHuman();
        }).every(function(player) {
            return player.getGesture();
        });
        expect(everyBotSetup).to.be.true;
    });

    it('#setGesture should trigger start of first round and announce winner or tie',function (done) {
        this.timeout(5000);
        //P0 is human type.
        var player = players[0];
        var gesture = gestures[0];
        function onStateChange() {
            var state = game.getState();
            var winnerAnnounced = state.info.indexOf('TIE!!!') !== -1
              || state.info.indexOf('wins !!!') !== -1;
            if(winnerAnnounced) {
                done();
            }
        }
        game.subscribe(onStateChange);
        game.setGesture(player, gesture);
    });

    it('#setGesture should trigger start of first round and start countdown', function(done) {
        this.timeout(5000);
        //P0 is human type.
        var player = players[0];
        var gesture = gestures[0];
        var countsCheck = counts.slice(0);
        function onStateChange() {
            var state = game.getState();
            if(!countsCheck.length) {
                done();
            }
            if(state.info === countsCheck[0]) {
                countsCheck.shift();
            }
        }
        game.subscribe(onStateChange);
        game.setGesture(player, gesture);
    });

    //TODO write test helpers to reuse code
    //TODO test are to complex think again about right architecture.
    it('#setGesture should trigger start of next round if previous is scored and announce winner or tie',function (done) {
        this.timeout(10000);
        //P0 is human type.
        var player = players[0];
        var gesture = gestures[0];
        var secondRoundStarted = false;
        var secondRoundCountStarted = false;
        function onStateChange() {
            var state = game.getState();
            var winnerAnnounced = state.info.indexOf('TIE!!!') !== -1
              || state.info.indexOf('wins !!!') !== -1;
            debugger;
            if(winnerAnnounced && !secondRoundStarted) {
                secondRoundStarted = true;
                game.setGesture(player, gesture);
            }
            if(secondRoundStarted && counts.indexOf(state.info) !== -1) {
                secondRoundCountStarted = true;
            }

            if(secondRoundCountStarted && secondRoundStarted && winnerAnnounced) {
                done();
            }
        }
        game.subscribe(onStateChange);
        game.setGesture(player, gesture);
    });

    it('#setGesture should NOT start a new round while counting', function(done) {
        //P0 is human type.
        var player = players[0];
        var gesture0 = gestures[0];
        var gesture1 = gestures[1];
        game.setGesture(player, gesture0);
        setTimeout(function() {
            game.setGesture(player, gesture1);
        }, 10);
        setTimeout(function() {
            //we start counter from 0
            expect(
              game.getState().info,
              "Round didn't start again"
            ).to.equal('1');
            expect(
              player.getGesture(),
              'gesture was applied'
            ).to.equal(gesture1);
            done();
        }, 110);
    });

    it('#addBot should add a bot player to the game', function () {
        game.addBot();
        var state = game.getState();
        expect(
          state.leftPane.length,
          'bot is added to left pane'
        ).to.equal(2);
        expect(
          state.rightPane.length,
          'right pane is unchanged'
        ).to.equal(1);
    });

    it('#removeBot should remove a bot player', function () {
        game.addBot();
        game.addBot();
        var state = game.getState();
        game.removeBot();
        expect(
          state.rightPane.length,
          'Bot is added to left pane'
        ).to.equal(1);
        expect(
          state.leftPane.length,
          'Bot on the left pane is not removed'
        ).to.equal(2);
    });

    it('game should set default counter interval of one second', function (done) {
        var game = Game(players, gestures, counts);
        //P0 is human type.
        var player = players[0];
        var gesture = gestures[0];
        game.setGesture(player, gesture);
        setTimeout(function() {
            //we start counter from 0
            expect(game.getState().info).to.equal('0');
        }, 990);
        setTimeout(function() {
            //we start counter from 0
            expect(game.getState().info).to.equal('1');
            done();
        }, 1010);
    });
});