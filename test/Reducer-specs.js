'use strict';

var expect = require('chai').expect;
var Reducer = require('../src/js/reducer.js');
var Actions = require('../src/js/actions.js');
var Player = require('../src/js/domain/player.js');

describe('Reducer specs:', function () {
    var state;

    beforeEach(function () {
        state = {
            players: [Player('P0', true), Player('P1', false), Player('P2', false)],
            gestures: ['rock', 'paper', 'scissors'],
            logs: [[
                {
                    name: 'P0',
                    gesture: 'scissors',
                    isWinner: false
                },
                {
                    name: 'P1',
                    gesture: 'scissors',
                    isWinner: false
                },
                {
                    name: 'P2',
                    gesture: 'scissors',
                    isWinner: false
                }
            ]]
        };
    });

    it('Reducer should handle INIT_STATE', function () {
        var actionState = {dummyField: {}};
        var newState = Reducer(state, Actions.initState(actionState));
        expect(newState).to.equal(actionState);
    });

    it('Reducer should handle GESTURE_CHANGE', function () {
        var newState = Reducer(state, Actions.gestureChange('P0', 'rock'));
        expect(newState.players[0].getGesture()).to.equal('rock');
    });

    it('Reducer should handle GESTURE_CHANGE - non existing player', function () {
        function wrapper() {
            Reducer(state, Actions.gestureChange('P3', 'rock'));
        }
        expect(wrapper).to.throw(Error);
    });

    it('Reducer should handle SET_BOTS_GESTURE', function () {
        var newState = Reducer(state, Actions.setBotsGestures());

        var filteredPlayers = newState.players.filter(function(player) {
            return !player.getGesture();
        });
        expect(
          filteredPlayers.length,
          'Human players have gesture untouched'
        ).to.equal(1);
        expect(
          filteredPlayers[0].isHuman(),
          'Human player is really human'
        ).to.be.true;
    });

    it('Reducer should handle COUNTDOWN_START', function () {
        var newState = Reducer(state, Actions.countdownStart());
        expect(newState.counting).to.be.true;
    });

    it('Reducer should handle COUNTDOWN', function () {
        var newState = Reducer(state, Actions.countdown('Ro!'));
        expect(newState.count).to.equal('Ro!');
    });

    it('Reducer should handle SCORE - a player wins', function () {
        //pretend it was counting before
        state.counting = true;
        //set players gestures
        state.players[0].setGesture('rock');
        state.players[1].setGesture('scissors');
        state.players[2].setGesture('scissors');
        var previousLogLength = state.logs.length;
        var newState = Reducer(state, Actions.score(state.players[0]));
        expect(
          newState.winner,
          'Winner is announced'
        ).to.eql(state.players[0]);
        expect(
          newState.logs.length,
          'One Round log is added'
        ).to.equal(previousLogLength + 1);
        expect(
          newState.logs[0],
          'Round log has right information'
        ).to.eql([
            {
                name: 'P0',
                gesture: 'rock',
                isWinner: true,
                wins: 0
            },
            {
                name: 'P1',
                gesture: 'scissors',
                isWinner: false,
                wins: 0
            },
            {
                name: 'P2',
                gesture: 'scissors',
                isWinner: false,
                wins: 0
            }
        ]);
    });

    it('Reducer should handle SCORE - TIE', function () {
        //pretend it was counting before
        state.counting = true;
        //set players gestures
        state.players[0].setGesture('scissors');
        state.players[1].setGesture('scissors');
        state.players[2].setGesture('scissors');
        var previousLogLength = state.logs.length;
        var newState = Reducer(state, Actions.score(null));
        expect(
          newState.winner,
          'TIE is announced'
        ).to.be.null;
        expect(
          newState.scored,
          'Round is scored'
        ).to.be.true;
        expect(
          newState.logs.length,
          'One Round log is added'
        ).to.equal(previousLogLength + 1);
        expect(
          newState.logs[0],
          'Round log has right information'
        ).to.eql([
            {
                name: 'P0',
                gesture: 'scissors',
                isWinner: false,
                wins: 0
            },
            {
                name: 'P1',
                gesture: 'scissors',
                isWinner: false,
                wins: 0
            },
            {
                name: 'P2',
                gesture: 'scissors',
                isWinner: false,
                wins: 0
            }
        ]);
    });

    it('Reducer should handle ADD_BOT', function () {
        var p3 = Player('P3', false);
        var newState = Reducer(state, Actions.addBot(p3));
        expect(newState.players[3]).to.equal(p3);
    });

    it('Reducer should handle REMOVE_BOT', function () {
        var newState = Reducer(state, Actions.removeBot());
        expect(newState.players.length).to.equal(2);
    });

    it('Reducer should handle UPDATE_GESTURES', function () {
        var newGestures = ['1', '2', '3'];
        var newState = Reducer(state, Actions.updateGestures(newGestures));
        expect(newState.gestures).to.equal(newGestures);
    });

    it('Reducer should throw an error if action is undefined', function () {
        function wrapper() {
            Reducer(state);
        }
        expect(wrapper).to.throw(Error);
    });

    it('Reducer should throw an error if action.type is undefined', function () {
        function wrapper() {
            Reducer(state, {});
        }
        expect(wrapper).to.throw(Error);
    });

    it('Reducer should throw an error if action.type is not matched', function () {
        function wrapper() {
            Reducer(state, {type: 'DUMMY_TYPE'});
        }
        expect(wrapper).to.throw(Error);
    });
});
