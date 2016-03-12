'use strict';

var expect = require('chai').expect;

//TODO: investigate mocha test generators
describe('Game specs:', function () {

    var gestures = ["rock", "paper", "scissors"];

    it('#play() Player1: Rock, Player2: Scissors', function () {
        var player1 = new Player('Human');
        var player2 = new Player('Computer');

        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[2]);

        var game = Game([player1, player2], gestures);

        expect(game.play(), 'Game returned wrong winner')
          .to.eql(player1);
    });

    it('#play() Player1: Rock, Player2: Paper', function () {
        var player1 = new Player('Human');
        var player2 = new Player('Computer');

        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[1]);

        var game = Game([player1, player2], gestures);

        expect(game.play(), 'Game returned wrong winner')
          .to.eql(player2);
    });

    it('#play() Player1: Scissors, Player2: Paper', function () {
        var player1 = new Player('Human');
        var player2 = new Player('Computer');

        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[1]);

        var game = Game([player1, player2], gestures);

        expect(game.play(), 'Game returned wrong winner')
          .to.eql(player1);
    });

    it('#play() Player1: Rock, Player2: Rock', function () {
        var player1 = new Player('Human');
        var player2 = new Player('Computer');

        player1.setGesture(gestures[0]);
        player2.setGesture(gestures[0]);

        var game = Game([player1, player2], gestures);

        expect(game.play(), 'Game returned wrong winner')
          .to.be.undefined;
    });

    it('#play() Player1: Paper, Player2: Paper', function () {
        var player1 = new Player('Human');
        var player2 = new Player('Computer');

        player1.setGesture(gestures[1]);
        player2.setGesture(gestures[1]);

        var game = Game([player1, player2], gestures);

        expect(game.play(), 'Game returned wrong winner')
          .to.be.undefined;
    });

    it('#play() Player1: Scissors, Player2: Scissors', function () {
        var player1 = new Player('Human');
        var player2 = new Player('Computer');

        player1.setGesture(gestures[2]);
        player2.setGesture(gestures[2]);

        var game = Game([player1, player2], gestures);

        expect(game.play(), 'Game returned wrong winner')
          .to.be.undefined;
    });
});
