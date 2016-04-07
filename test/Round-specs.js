'use strict';

var expect = require('chai').expect;

var Player = require('../src/js/domain/Player.js');
var Round = require('../src/js/domain/Round.js');

//TODO: investigate mocha test generators
describe('Game specs:', function () {

    var gestures = ["rock", "paper", "scissors"];
    var player1, player2;
    beforeEach(function() {
        player1 = new Player('Human');
        player2 = new Player('Computer');
    });

    it('#play() Player1: Rock, Player2: Scissors', function () {
        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[2]);

        var round = Round([player1, player2], gestures);

        expect(round.score()).to.eql(player1);
    });

    it('#play() Player1: Rock, Player2: Paper', function () {
        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[1]);

        var round = Round([player1, player2], gestures);

        expect(round.score()).to.eql(player2);
    });

    it('#play() Player1: Scissors, Player2: Paper', function () {
        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[1]);

        var round = Round([player1, player2], gestures);

        expect(round.score()).to.eql(player1);
    });

    it('#play() Player1: Rock, Player2: Rock', function () {
        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[0]);

        var round = Round([player1, player2], gestures);

        expect(round.score()).to.be.undefined;
    });

    it('#play() Player1: Paper, Player2: Paper', function () {
        player1.setGesture(gestures[1]);
        player2.setGesture(gestures[1]);

        var round = Round([player1, player2], gestures);

        expect(round.score()).to.be.undefined;
    });

    it('#play() Player1: Scissors, Player2: Scissors', function () {
        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[2]);

        var round = Round([player1, player2], gestures);

        expect(round.score()).to.be.undefined;
    });

    it('#isScored() should return whether round', function () {
        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[2]);

        var round = Round([player1, player2], gestures);

        expect(round.isScored()).to.equal(false);
        round.score();
        expect(round.isScored()).to.equal(true);
    });
});
