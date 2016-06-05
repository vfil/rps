'use strict';

var expect = require('chai').expect;
var Actions = require('../src/js/actions.js');

describe('Actions specs:', function () {

    it('#gestureChange should create proper action', function () {
        var name = 'Player1';
        var expectedAction = {
            type: 'GESTURE_CHANGE',
            gesture: 'rock',
            playerName: name
        };
        expect(Actions.gestureChange(name, 'rock')).to.eql(expectedAction);
    });

    it('#countdown should create proper action', function () {
        var count = 'RO!!!';
        var expectedAction = {
            type: 'COUNTDOWN',
            count: count
        };
        expect(Actions.countdown(count)).to.eql(expectedAction);
    });

    it('#score should create proper action', function () {
        var dummyWinner = {};
        var expectedAction = {
            type: 'SCORE',
            winner: dummyWinner
        };
        expect(Actions.score(dummyWinner)).to.eql(expectedAction);
    });

    it('#resetPlayersWins should create proper action', function () {
        var expectedAction = {
            type: 'RESET_PLAYERS_WINS'
        };
        expect(Actions.resetPlayersWins()).to.eql(expectedAction);
    });

    it('#gameEnd should create proper action', function () {
        var dummyWinner = {};
        var expectedAction = {
            type: 'GAME_END',
            winner: dummyWinner
        };
        expect(Actions.gameEnd(dummyWinner)).to.eql(expectedAction);
    });

    it('#addBot should create proper action', function () {
        var dumbPlayer = {};
        var expectedAction = {
            type: 'ADD_BOT',
            player: dumbPlayer
        };
        expect(Actions.addBot(dumbPlayer)).to.eql(expectedAction);
    });

    it('#removeBot should create proper action', function () {
        var expectedAction = {
            type: 'REMOVE_BOT'
        };
        expect(Actions.removeBot()).to.eql(expectedAction);
    });

    it('#updateGestures should create proper action', function () {
        var gestures = ['rock', 'paper', 'scissors', 'spock', 'lizard'];
        var expectedAction = {
            type: 'UPDATE_GESTURES',
            gestures: gestures
        };
        expect(Actions.updateGestures(gestures)).to.eql(expectedAction);
    });
});
