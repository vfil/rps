'use strict';

var expect = require('chai').expect;
var Player = require('../src/js/domain/player.js');
var mapFunc = require('../src/js/mapStateToProps.js');

describe('MapStateToProps specs:', function () {
    var players = [
        Player('Computer'),
        Player('You', true)
    ];
    players[0].setGesture('rock');
    players[1].setGesture('paper');
    players[1].incrementWins();
    players[1].incrementGameWins();
    var gestures = ['rock', 'paper', 'scissors'];

    it('MapStateToProps computes basic properties', function () {
        var state = getInitialState();
        var expectedProps = {
            counting: state.counting,
            gestures: state.gestures,
            leftPane: [{
                name: 'Computer',
                gesture: 'rock',
                wins: 0,
                gameWins: 0,
                isHuman: false
            }],
            rightPane: [{
                name: 'You',
                gesture: 'paper',
                wins: 1,
                gameWins: 1,
                isHuman: true
            }],
            info: {
                message: 'Choose throw!',
                hint: 'Feeling lucky? Hit enter or space!'
            },
            logs: state.logs
        };
        var actualProps = mapFunc(state);
        expect(
          actualProps.counting,
          'props.counting'
        ).to.equal(expectedProps.counting);
        expect(
          actualProps.gestures,
          'props.gestures'
        ).to.equal(expectedProps.gestures);
        expect(
          actualProps.leftPane,
          'props.leftPane'
        ).to.eql(expectedProps.leftPane);
        expect(
          actualProps.rightPane,
          'props.rightPane'
        ).to.eql(expectedProps.rightPane);
        expect(
          actualProps.info,
          'props.info'
        ).to.eql(expectedProps.info);
        expect(
          actualProps.logs,
          'props.logs'
        ).to.eql(expectedProps.logs);
    });

    it('MapStateToProps should handle counting state', function () {
        var state = getInitialState();
        state.counting = true;
        state.count = 'Ro!';
        var actualProps = mapFunc(state);
        var expectedInfo = {
            message: 'Ro!',
            hint: ''
        };
        expect(actualProps.info).to.eql(expectedInfo);
    });

    it('MapStateToProps should handle tie score', function () {
        var state = getInitialState();
        state.scored = true;
        state.ended = false;
        state.winner = null;
        var actualProps = mapFunc(state);
        var expectedInfo = {
            message: 'TIE!',
            hint: 'Choose throw!'
        };
        expect(actualProps.info).to.eql(expectedInfo);
    });

    it('MapStateToProps should handle human round win', function () {
        var state = getInitialState();
        state.scored = true;
        state.ended = false;
        state.winner = players[1];
        var actualProps = mapFunc(state);
        var expectedInfo = {
            message: 'You win!',
            hint: 'Choose throw!'
        };
        expect(actualProps.info).to.eql(expectedInfo);
    });

    it('MapStateToProps should handle computer round win', function () {
        var state = getInitialState();
        state.scored = true;
        state.ended = false;
        state.winner = players[0];
        var actualProps = mapFunc(state);
        var expectedInfo = {
            message: 'You lost!',
            hint: 'Choose throw!'
        };
        expect(actualProps.info).to.eql(expectedInfo);
    });

    it('MapStateToProps should handle human game win', function () {
        var state = getInitialState();
        state.scored = true;
        state.ended = true;
        state.winner = players[1];
        var actualProps = mapFunc(state);
        var expectedInfo = {
            message: 'You win the game!',
            hint: 'Choose throw to start a new game!'
        };
        expect(actualProps.info).to.eql(expectedInfo);
    });

    it('MapStateToProps should handle computer game win', function () {
        var state = getInitialState();
        state.scored = true;
        state.ended = true;
        state.winner = players[0];
        var actualProps = mapFunc(state);
        var expectedInfo = {
            message: 'You lost the game!',
            hint: 'Choose throw to start a new game!'
        };
        expect(actualProps.info).to.eql(expectedInfo);
    });

    function getInitialState() {
        return {
            players: players,
            gestures: gestures,
            counting: false,
            count: null,
            winner: null,
            scored: false,
            ended: false,
            logs: []
        };
    }
});
