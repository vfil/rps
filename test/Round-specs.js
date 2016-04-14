'use strict';

var expect = require('chai').expect;

var Player = require('../src/js/domain/player.js');
var Round = require('../src/js/domain/round.js');

//TODO: investigate mocha test generators
describe('Game specs:', function () {

    var gestures = ["rock", "paper", "scissors"];
    var player1, player2;
    beforeEach(function () {
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

        expect(round.score()).to.be.null;
    });

    it('#play() Player1: Paper, Player2: Paper', function () {
        player1.setGesture(gestures[1]);
        player2.setGesture(gestures[1]);

        var round = Round([player1, player2], gestures);

        expect(round.score()).to.be.null;
    });

    it('#play() Player1: Scissors, Player2: Scissors', function () {
        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[2]);

        var round = Round([player1, player2], gestures);

        expect(round.score()).to.be.null;
    });

    it('#isScored() should return whether round is scored', function () {
        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[2]);

        var round = Round([player1, player2], gestures);

        expect(round.isScored()).to.equal(false);
        round.score();
        expect(round.isScored()).to.equal(true);
    });

    it('#score() should throw an error if score is called consecutively', function () {
        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[2]);
        var round = Round([player1, player2], gestures);
        round.score();
        function wrapper() {
            round.score();
        }

        expect(wrapper).to.throw(Error);
    });

    it('#score() should throw an error if gesture are less then 2', function () {
        var gestures = ["rock", "paper"];
        player1.setGesture(gestures[1]);
        player2.setGesture(gestures[0]);
        var round = Round([player1, player2], gestures);
        function wrapper() {
            round.score();
        }
        expect(wrapper).to.throw(Error);
    });

    it('#score() should throw an error if gesture length is odd number', function () {
        var gestures = ["rock", "paper", "scissors", "spock"];
        player1.setGesture(gestures[1]);
        player2.setGesture(gestures[0]);
        var round = Round([player1, player2], gestures);
        function wrapper() {
            round.score();
        }
        expect(wrapper).to.throw(Error);
    });

    it('#score() should throw an error if player has not existing gesture', function () {
        player1.setGesture(gestures[1]);
        player2.setGesture("Lizard");
        var round = Round([player1, player2], gestures);
        function wrapper() {
            round.score();
        }
        expect(wrapper).to.throw(Error);
    });
});
