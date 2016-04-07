'use strict';

//TODO rename this file and delete previous impl
//TODO write functional tests.
(function () {

    var Game = require('./domain/Game.js');
    var Player = require('./domain/Player.js');
    var VGame = require('./components/VGame.js');
    var VDOM = require('./common/vdom/VDOM.js');

    //initialize game gestures and players
    var gestures = ['rock', 'paper', 'scissors'];
    var players = [
        Player('Sandu', true),
        Player('Computer1')
    ];
    var counts = ['1!!!', '2!!!', '3!!!'];

    var game = Game(players, gestures, counts);

    game.subscribe(render);
    render();

    function render() {
        var props = stateToProps(game.getState());
        var gameView = VGame(props);
        VDOM.render(gameView, document.getElementById('app'));
    }

    function stateToProps(state) {
        return {
            gestures: state.gestures,
            leftPane: state.leftPane,
            rightPane: state.rightPane,
            info: state.info,
            logs: state.logs,
            onGestureChange: game.setGesture,
            onAddBot: game.addBot,
            onRemoveBot: game.removeBot
        };
    }

})();