'use strict';

var expect = require('chai').expect;
var Actions = require('../src/js/common/actions.js');

describe('Actions specs:', function () {
    //TODO mocha test generator???
    it('#gestureChange should create proper action', function () {
        var dummyPlayer = {};
        var expectedAction = {
            type: 'GESTURE_CHANGE',
            gesture: 'rock',
            player: dummyPlayer
        };
        expect(Actions.gestureChange(dummyPlayer, 'rock')).to.eql(expectedAction);
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

    it('#addBot should create proper action', function () {
        var expectedAction = {
            type: 'ADD_BOT'
        };
        expect(Actions.addBot()).to.eql(expectedAction);
    });

    it('#removeBot should create proper action', function () {
        var expectedAction = {
            type: 'REMOVE_BOT'
        };
        expect(Actions.removeBot()).to.eql(expectedAction);
    });
});
