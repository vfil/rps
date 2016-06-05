'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var lolex = require('lolex');
var Player = require('../src/js/domain/player.js');
var reducer = require('../src/js/reducer.js');
var Store = require('../src/js/common/store.js');
var Actions = require('../src/js/actions.js');
var fakeDelayedExecutor = require('./testUtils.js').delayedExecutor;
var delayedExecutor = require('../src/js/delayedExecutor.js');
var Judge = require('../src/js/domain/judge.js');
var LogStore = require('../src/js/domain/logStore.js');
var GuessStrategy = require('../src/js/domain/guessStrategy.js');
var patchStore = require('./testUtils.js').patchStore;
var RPS = require('../src/js/rps.js');

describe('RPS game specs:', function () {
    var store,
        players,
        stubGuessStrategyRandom;

    beforeEach(function () {
        store = Store(reducer, {});
        players = [
            Player('You', true),
            Player('Computer')
        ];
    });

    it('Rps should have right gestures set', function () {
        var expectedGestures = ['rock', 'paper', 'scissors'];
        initRPS();
        var state = store.getState();
        expect(state.gestures).to.eql(expectedGestures);
    });

    it('Rps should have players set', function () {
        initRPS();
        var state = store.getState();
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
    });

    it('Rps should have other state variables set', function () {
        initRPS();
        var state = store.getState();
        expect(
          state.counting,
          'state.counting is set properly'
        ).to.be.false;
        expect(
          state.count,
          'state.count is set properly'
        ).to.be.null;
        expect(
          state.winner,
          'state.winner is set properly'
        ).to.be.null;
        expect(
          state.scored,
          'state.scored is set properly'
        ).to.be.false;
    });

    it('Rps should start with empty rounds logs', function () {
        initRPS();
        var state = store.getState();
        expect(state.logs).to.eql([]);
    });

    it('Rps should set gesture for player', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(), 'You', 'rock');
        var expectedAction = {
            type: Actions.types.GESTURE_CHANGE,
            playerName: 'You',
            gesture: 'rock'
        };
        expect(actions[0]).to.eql(expectedAction);
    });

    it('Rps should reset gestures for players after winner is announced', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(), 'You', 'rock');
        var expectedAction = {
            type: Actions.types.RESET_PLAYERS_GESTURES
        };
        expect(actions[7]).to.eql(expectedAction);
    });

    it('Rps should set random gesture for player', function () {
        var game = initRPS();
        game.chooseRandomGesture();
        expect(stubGuessStrategyRandom.calledWith(['rock', 'paper', 'scissors'])).to.be.true;
    });

    it('Rps should NOT set same random gesture for player in a row', function () {
        //pretend user already has a gesture selected
        players[0].setGesture('rock');
        var game = initRPS();
        game.chooseRandomGesture();
        expect(stubGuessStrategyRandom.calledWith(['paper', 'scissors'])).to.be.true;
    });

    it('Rps should choose gestures for bot', function () {
        var game = initRPS();
        var actions = recordActionsOnGestureChange(store, game, 'You', 'rock');
        var action = actions[1];
        var expectedAction = {
            type: Actions.types.GESTURE_CHANGE,
            gesture: 'paper',
            playerName: 'Computer'
        };
        expect(action).to.eql(expectedAction);
    });

    it('Rps should start counting on initial gesture change', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(), 'You', 'rock');
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

    it('Rps should announce round winner after initial gesture change', function () {
        var actions = recordActionsOnGestureChange(store, initRPS(), 'You', 'rock');
        expect(actions[6].type).to.equal(Actions.types.SCORE);
    });

    it('Rps should announce game end', function () {
        players[0].incrementWins();
        players[0].incrementWins();
        var actions = recordActionsOnGestureChange(store, initRPS(), 'You', 'scissors');
        expect(
          actions[7].type,
          'GAME_END action was dispatched'
        ).to.equal(Actions.types.GAME_END);
        expect(players[0].getGameWins()).to.equal(1);
    });

    it('Rps should start a new game on gesture change', function () {
        players[0].incrementWins();
        players[0].incrementWins();
        var game = initRPS();
        game.changeGesture('You', 'scissors');
        var getActions = patchStore(store);
        //starting a new game here
        game.changeGesture('You', 'scissors');
        var actions = getActions();
        expect(
          actions[0].type,
          'Reset Wins action is triggered'
        ).to.equal(Actions.types.RESET_PLAYERS_WINS);
        expect(
          actions[1].type,
          'Init action is triggered'
        ).to.equal(Actions.types.INIT_STATE);
        //wins is 1 because in the new game player wins.
        expect(
          players[0].getWins(),
          'Wins is reseted'
        ).to.equal(1);
    });

    it('Rps is NOT starting a new round while counting, only set gesture for player', function () {
        var game = initRPS();
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
        var game = initRPS();
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
        var game = initRPS();
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
        var game = initRPS();
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
        var game = initRPS();
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
        var game = initRPS();
        game.addBot();
        var getActions = patchStore(store);
        game.removeBot();
        var action = getActions()[0];
        expect(action).to.eql({type: Actions.types.REMOVE_BOT});
    });

    it('Rps should NOT remove last added bot if only 2 players', function () {
        var game = initRPS();
        var getActions = patchStore(store);
        game.removeBot();
        var actions = getActions();
        expect(actions.length).to.equal(0);
    });

    it('Rps should change gestures when less then 3 players', function () {
        var expectedGestures = ['rock', 'paper', 'scissors'];
        var game = initRPS();
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
        var game = initRPS();
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
    function initRPS() {
        var renderFunc = function () {};
        var judge = Judge();
        var guessStrategy = GuessStrategy();
        //turn guessStrategy random method in a predictable one.
        stubGuessStrategyRandom = sinon.stub(guessStrategy, 'random').returns('paper');
        var logStore = LogStore();
        return RPS(players, store, renderFunc, fakeDelayedExecutor, judge, guessStrategy, logStore);
    }

    function recordActionsOnGestureChange(store, game, name, gesture) {
        var getActions = patchStore(store);
        game.changeGesture(name, gesture);
        return getActions();
    }
});

describe('RPS game specs - async behaviour:', function () {
    it('Rps should NOT reset gestures for players if round not scored', function () {
        var players = [
            Player('You', true),
            Player('Computer')
        ];
        var store = Store(reducer, {});
        var renderFunc = function () {
        };
        var clock = lolex.install();
        var game = RPS(players, store, renderFunc, delayedExecutor, Judge(), GuessStrategy(), LogStore(), 100);
        //simulate later user click before gesture is reset
        setTimeout(function () {
            game.changeGesture('You', 'paper');
        }, 310);
        game.changeGesture('You', 'rock');
        //got to the point in time where in normal situation reset gestures should be done
        clock.tick(410);
        clock.uninstall();
        expect(players[0].getGesture()).to.equal('paper');
    });
});

describe('RPS game specs - multiple bots:', function () {

    it('Rps should choose gestures for bot', function () {
        var players = [
            Player('You', true),
            Player('Computer1'),
            Player('Computer2')
        ];
        var store = Store(reducer, {});
        var renderFunc = function () {
        };
        var guessStrategy = GuessStrategy();
        var game = RPS(players, store, renderFunc, fakeDelayedExecutor, Judge(), guessStrategy, LogStore(), 100);
        sinon.stub(guessStrategy, 'random').returns('paper');
        var getActions = patchStore(store);
        game.changeGesture('You', 'rock');
        var actions = getActions();
        var expectedAction = {
            type: Actions.types.GESTURE_CHANGE,
            gesture: 'paper',
            playerName: 'Computer1'
        };
        expect(actions[1]).to.eql(expectedAction);
        expectedAction = {
            type: Actions.types.GESTURE_CHANGE,
            gesture: 'paper',
            playerName: 'Computer2'
        };
        expect(actions[2]).to.eql(expectedAction);
    });
});
