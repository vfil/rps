'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Player = require('../src/js/domain/player.js');
var reducer = require('../src/js/reducer.js');
var Store = require('../src/js/common/store.js');
var Actions = require('../src/js/actions.js');
var delayedExecutor = require('./testUtils.js').delayedExecutor;
var Judge = require('../src/js/domain/judge.js');
var LogStore = require('../src/js/domain/logStore.js');
var GuessStrategy = require('../src/js/domain/guessStrategy.js');
var patchStore = require('./testUtils.js').patchStore;
var RPS = require('../src/js/rps.js');

describe('RPS game 2 players specs:', function () {
    var store;
    var players;

    beforeEach(function () {
        store = Store(reducer, {});
        players = [
            Player('You', true),
            Player('Computer')
        ];
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
            ).to.eql('You');
            expect(
              player2.getName(),
              'Second player has right name'
            ).to.eql('Computer');
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

    it('Rps should have other state variables set', function (done) {
        function renderFunc(props) {
            expect(
              props.counting,
              'state.counting is set properly'
            ).to.be.false;
            expect(
              props.count,
              'state.count is set properly'
            ).to.be.null;
            expect(
              props.winner,
              'state.winner is set properly'
            ).to.be.null;
            expect(
              props.scored,
              'state.scored is set properly'
            ).to.be.false;
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
        var actions = recordActionsOnGestureChange(store, initRPS(store), 'You', 'rock');
        var expectedAction = {
            type: Actions.types.GESTURE_CHANGE,
            playerName: 'You',
            gesture: 'rock'
        };
        expect(actions[0]).to.eql(expectedAction);
    });

    it('Rps should reset gestures for players after winner is announced', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(store), 'You', 'rock');
        var expectedAction = {
            type: Actions.types.RESET_PLAYERS_GESTURES
        };
        expect(actions[7]).to.eql(expectedAction);
    });

    xit('Rps should NOT reset gestures for players if round not scored', function () {
        store.dispatch(Actions.countdownStart());
        var expectedAction = {
            type: Actions.types.RESET_PLAYERS_GESTURES
        };
    });

    it('Rps should set random gesture for player', function () {
        var renderFunc = function () {};
        var judge = Judge();
        var guessStrategy = GuessStrategy();
        var spy = sinon.spy(guessStrategy, 'random');
        var logStore = LogStore();
        var game = initRPS(store, renderFunc, judge, guessStrategy, logStore);
        game.chooseRandomGesture();
        expect(spy.calledWith(['rock', 'paper', 'scissors'])).to.be.true;
    });

    it('Rps should NOT set same random gesture for player in a row', function () {
        //pretend user already has a gesture selected
        players[0].setGesture('rock');
        var renderFunc = function () {};
        var judge = Judge();
        var guessStrategy = GuessStrategy();
        var spy = sinon.spy(guessStrategy, 'random');
        var logStore = LogStore();
        var game = initRPS(store, renderFunc, judge, guessStrategy, logStore);
        game.chooseRandomGesture();
        expect(spy.calledWith(['paper', 'scissors'])).to.be.true;
    });

    it('Rps should choose gestures for bots', function () {
        var renderFunc = function () {};
        var judge = Judge();
        var guessStrategy = GuessStrategy();
        var logStore = LogStore();
        var game = initRPS(store, renderFunc, judge, guessStrategy, logStore);
        var actions = recordActionsOnGestureChange(store, game, 'You', 'rock');
        var action = actions[1];
        var expectedAction = {
            type: Actions.types.SET_BOTS_GESTURE,
            guessStategy: guessStrategy,
            logStore: logStore,
            judge: judge
        };
        expect(action).to.eql(expectedAction);
    });

    it('Rps should start counting on initial gesture change', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(store), 'You', 'rock');
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
            count: 'Ro!'
        });
        expect(
          actions[4],
          'countdown 2'
        ).to.eql({
            type: Actions.types.COUNTDOWN,
            count: 'Sham!'
        });
        expect(
          actions[5],
          'countdown 3'
        ).to.eql({
            type: Actions.types.COUNTDOWN,
            count: 'Bo!'
        });
    });

    it('Rps should announce winner after initial gesture change', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(store), 'You', 'rock');
        expect(actions[6].type).to.equal(Actions.types.SCORE);
    });

    it('Rps is NOT starting a new round while counting, only set gesture for player', function () {
        var game = initRPS(store);
        store.dispatch(Actions.countdownStart());
        var actions = recordActionsOnGestureChange(store, game, 'You', 'rock');
        var expectedAction = {
            type: Actions.types.GESTURE_CHANGE,
            playerName: 'You',
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
        var game = initRPS(store);
        var getActions = patchStore(store);
        game.addBot();
        var action = getActions()[0];
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

    it('Rps should only update gestures when necessary', function () {
        players = players.concat([Player('Computer2')]);
        var game = initRPS(store);
        var getActions = patchStore(store);
        game.addBot();
        var actions = getActions();
        expect(
          actions[0].type,
          'Action type matches'
        ).to.equal(Actions.types.ADD_BOT);
        expect(
          actions.length,
          'Only ADD_BOT was triggered'
        ).to.equal(1);
    });

    it('Rps should NOT add a new bot player if there are 4 players already', function () {
        players = players.concat([Player('Computer2'), Player('Computer3')]);
        var getActions = patchStore(store);
        var game = initRPS(store);
        game.addBot();
        var actions = getActions();
        expect(
          actions[0].type,
          'INIT_STATE action was triggered'
        ).to.equal(Actions.types.INIT_STATE);
        expect(
          actions.length,
          'Only INIT_STATE action was triggered'
        ).to.equal(1);
    });

    it('Rps should change gestures when more then 2 players', function () {
        var expectedGestures = ['rock', 'paper', 'scissors', 'spock', 'lizard'];
        var game = initRPS(store);
        var getActions = patchStore(store);
        game.addBot();
        var action = getActions()[1];
        expect(
          action.type,
          'Action type matches'
        ).to.equal(Actions.types.UPDATE_GESTURES);
        expect(
          action.gestures,
          'Gestures are set'
        ).to.eql(expectedGestures);
    });

    it('Rps should remove last added bot', function () {
        var game = initRPS(store);
        game.addBot();
        var getActions = patchStore(store);
        game.removeBot();
        var action = getActions()[0];
        expect(action).to.eql({type: Actions.types.REMOVE_BOT});
    });

    it('Rps should NOT remove last added bot if only 2 players', function () {
        var game = initRPS(store);
        var getActions = patchStore(store);
        game.removeBot();
        var actions = getActions();
        expect(actions.length).to.equal(0);
    });

    it('Rps should change gestures when less then 3 players', function () {
        var expectedGestures = ['rock', 'paper', 'scissors'];
        var game = initRPS(store);
        game.addBot();
        var getActions = patchStore(store);
        game.removeBot();
        var action = getActions()[1];
        expect(action).to.eql({
            type: Actions.types.UPDATE_GESTURES,
            gestures: expectedGestures
        });
    });

    it('Rps should NOT change gestures when more then 3 players left', function () {
        players = players.concat([Player('Computer2'), Player('Computer3')]);
        var game = initRPS(store);
        var getActions = patchStore(store);
        game.removeBot();
        var actions = getActions();
        expect(
          actions[0],
          'Remove bot action is dispatched'
        ).to.eql({
            type: Actions.types.REMOVE_BOT
        });
        expect(
          actions.length,
          'Only Remove bot action is dispatched'
        ).to.equal(1);
    });

    //helper functions
    function initRPS(store, renderFunc, judge, guessStrategy, logStore) {
        renderFunc = renderFunc || function () {
          };
        judge = judge || Judge();
        guessStrategy = guessStrategy || GuessStrategy();
        logStore = logStore || LogStore();
        return RPS(players, store, renderFunc, delayedExecutor, judge, guessStrategy, logStore);
    }

    function recordActionsOnGestureChange(store, game, name, gesture) {
        var getActions = patchStore(store);
        game.changeGesture(name, gesture);
        return getActions();
    }
});
