'use strict';

var expect = require('chai').expect;
var reducer = require('../src/js/reducer.js');
var Store = require('../src/js/common/store.js');
var Actions = require('../src/js/actions.js');
var counterFunc = require('./testUtils.js').counterFunc;
var patchStore = require('./testUtils.js').patchStore;
var RPS = require('../src/js/rps.js');

describe('RPS game 2 players specs:', function () {
    var store;

    beforeEach(function () {
        store = Store(reducer, {});
    });

    it('Rps should have right gestures set', function (done) {
        var expectedGestures = ['rock', 'paper', 'scissors'];

        function renderFunc(props) {
            expect(props.gestures).to.eql(expectedGestures);
            done();
        }
        initRPS(store, renderFunc);
    });

    it('Rps should have players set', function (done) {
        function renderFunc(state) {
            var player1 = state.players[0];
            var player2 = state.players[1];
            expect(
              player1.getName(),
              'First player has right name'
            ).to.eql('Sandu');
            expect(
              player2.getName(),
              'Second player has right name'
            ).to.eql('Computer1');
            expect(
              player1.isHuman(),
              'First player is human'
            ).to.be.true;
            expect(
              player2.isHuman(),
              'Second player is bot'
            ).to.be.false;
            done();

        }

        initRPS(store, renderFunc);
    });

    it('Rps should display initial hint for player', function (done) {
        function renderFunc(props) {
            expect(props.info).to.equal('Choose your punch!!!');
            done();
        }

        initRPS(store, renderFunc);
    });

    it('Rps should start with empty rounds logs', function (done) {
        function renderFunc(props) {
            expect(props.logs).to.eql([]);
            done();
        }

        initRPS(store, renderFunc);
    });

    it('Rps should set gesture for player', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(store));
        var expectedAction = {
            type: Actions.types.GESTURE_CHANGE,
            playerName: 'Sandu',
            gesture: 'rock'
        };
        expect(actions[0]).to.eql(expectedAction);
    });

    it('Rps should set random gesture for bots', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(store));
        var expectedAction = {
            type: Actions.types.SET_BOTS_GESTURE
        };
        expect(actions[1]).to.eql(expectedAction);
    });

    it('Rps should start counting on initial gesture change', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(store));
        expect(
          actions[2],
          'count down start action'
        ).to.eql({
            type: Actions.types.COUNTDOWN_START
        });
        expect(
          actions[3],
          'countdown 1'
        ).to.eql({
            type: Actions.types.COUNTDOWN,
            count: '1!'
        });
        expect(
          actions[4],
          'countdown 2'
        ).to.eql({
            type: Actions.types.COUNTDOWN,
            count: '2!'
        });
        expect(
          actions[5],
          'countdown 3'
        ).to.eql({
            type: Actions.types.COUNTDOWN,
            count: '3!'
        });
    });

    it('Rps should announce winner after initial gesture change', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(store));
        expect(actions[6].type).to.equal(Actions.types.SCORE);
    });

    it('Rps is NOT starting a new round while counting, only set gesture for player', function () {
        var game = initRPS(store);
        store.dispatch(Actions.countdownStart());
        var actions = recordActionsOnGestureChange(store, game);
        var expectedAction = {
            type: Actions.types.GESTURE_CHANGE,
            playerName: 'Sandu',
            gesture: 'rock'
        };
        expect(
          actions[0],
          'Player gesture is set'
        ).to.eql(expectedAction);

        expect(
          actions.length,
          'Only gesture change action was dispatched'
        ).to.equal(1);
    });

    it('Rps should add a new bot player', function () {
        var getActions = patchStore(store);
        var game = initRPS(store);
        game.addBot();
        var action = getActions()[1];
        expect(
          action.type,
          'Action type matches'
        ).to.equal(Actions.types.ADD_BOT);
        expect(
          action.player.getName(),
          'Player name is right'
        ).to.equal('Computer2');
        expect(
          action.player.isHuman(),
          'Player is bot'
        ).to.be.false;
    });

    it('Rps should remove last added bot', function () {
        var game = initRPS(store);
        game.addBot();
        var getActions = patchStore(store);
        game.removeBot();
        var action = getActions()[0];
        expect(action).to.eql({type: Actions.types.REMOVE_BOT});
    });

    //helper functions
    function initRPS(store, renderFunc) {
        renderFunc = renderFunc || function() {};
        return RPS(store, renderFunc, counterFunc);
    }

    function recordActionsOnGestureChange(store, game) {
        var getActions = patchStore(store);
        game.changeGesture('Sandu', 'rock');
        return getActions();
    }
});