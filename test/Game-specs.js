'use strict';

var expect = require('chai').expect;
var Game = require('../src/js/domain/game.js');
var Player = require('../src/js/domain/player.js');
var Judge = require('../src/js/domain/judge.js');

describe('Game specs:', function () {
    var game;
    var judge;
    var gestures = ['rock', 'paper', 'scissors'];
    var player1 = Player('Sandu', true);
    var player2 = Player('Computer1');

    beforeEach(function () {
        game = Game();
        judge = Judge();
    });

    it('Game should start and score round', function () {
        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[2]);
        game.startRound([player1, player2], gestures);
        expect(game.score(judge)).to.eql(player1);
    });

    it('#startRound should start round if previous round is scored', function () {
        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[2]);
        game.startRound([player1, player2], gestures);
        game.score(judge);
        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[1]);
        game.startRound([player1, player2], gestures);
        expect(game.score(judge)).to.eql(player2);
    });

    it('#startRound should throw error if new round if started before scoring previous', function () {
        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[2]);
        game.startRound([player1, player2], gestures);
        function wrapper() {
            game.startRound([player1, player2], gestures);
        }
        expect(wrapper).to.throw(Error);
    });

    it('#score should throw an error when trying to score round before starting', function () {
        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[2]);
        function wrapper() {
            game.score(judge);
        }
        expect(wrapper).to.throw(Error);
    });
});
