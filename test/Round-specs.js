'use strict';

var expect = require('chai').expect;

var Player = require('../src/js/domain/player.js');
var Round = require('../src/js/domain/round.js');
var Judge = require('../src/js/domain/judge.js');

describe('Round specs - game rules:', function () {
    var gestures = ['rock', 'paper', 'scissors'];

    var tests = [
        {
            throws: ['rock', 'scissors'],
            winner: 0
        },
        {
            throws: ['rock', 'paper'],
            winner: 1
        },
        {
            throws: ['scissors', 'paper'],
            winner: 0
        },
        {
            throws: ['rock', 'rock'],
            winner: null
        },
        {
            throws: ['paper', 'paper'],
            winner: null
        },
        {
            throws: ['scissors', 'scissors'],
            winner: null
        }
    ];

    tests.forEach(function (test) {
        it('#play() Player1 ' + test.throws[0] + ', Player2 ' + test.throws[1], function () {
            var players = [new Player('Human'), new Player('Computer')];
            var judge = Judge();
            var round = Round(players, gestures);
            players[0].setGesture(test.throws[0]);
            players[1].setGesture(test.throws[1]);
            if(test.winner === null) {
                expect(round.score(judge)).to.be.null;
            } else {
                expect(round.score(judge)).to.eql(players[test.winner]);
            }
        });
    });
});

describe('Round specs - round behaviour:', function () {

    var gestures = ['rock', 'paper', 'scissors'],
        player1,
        player2,
        judge;
    beforeEach(function () {
        player1 = new Player('Human');
        player2 = new Player('Computer');
        judge = Judge();
    });

    it('#isScored() should return whether round is scored', function () {
        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[2]);

        var round = Round([player1, player2], gestures);

        expect(round.isScored()).to.equal(false);
        round.score(judge);
        expect(round.isScored()).to.equal(true);
    });

    it('#score() should throw an error if score is called consecutively', function () {
        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[2]);
        var round = Round([player1, player2], gestures);
        round.score(judge);
        function wrapper() {
            round.score(judge);
        }

        expect(wrapper).to.throw(Error);
    });

    it('#score() should throw an error if gesture are less then 2', function () {
        var gestures = ['rock', 'paper'];
        player1.setGesture(gestures[1]);
        player2.setGesture(gestures[0]);
        var round = Round([player1, player2], gestures);
        function wrapper() {
            round.score(judge);
        }
        expect(wrapper).to.throw(Error);
    });

    it('#score() should throw an error if gesture length is odd number', function () {
        var gestures = ['rock', 'paper', 'scissors', 'spock'];
        player1.setGesture(gestures[1]);
        player2.setGesture(gestures[0]);
        var round = Round([player1, player2], gestures);
        function wrapper() {
            round.score(judge);
        }
        expect(wrapper).to.throw(Error);
    });

    it('#score() should throw an error if player has not existing gesture', function () {
        player1.setGesture(gestures[1]);
        player2.setGesture('Lizard');
        var round = Round([player1, player2], gestures);
        function wrapper() {
            round.score(judge);
        }
        expect(wrapper).to.throw(Error);
    });
});
