'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils.js');
var VPlayerPane = require('../src/js/components/VPlayerPane.js');

describe('VPlayerPane specs:', function () {
    var props,
        renderedInstance,
        onGestureChange = new Function();
    beforeEach(function () {
        props = {
            onGestureChange: onGestureChange,
            gestures: ['rock', 'paper', 'scissors'],
            players: [
                {
                    isHuman: false,
                    name: 'Wally',
                    gesture: 'rock',
                    wins: 0
                },
                {
                    isHuman: true,
                    name: 'Foo',
                    gesture: 'paper',
                    wins: 3
                }
            ],
            counting: false
        };
        renderedInstance = VPlayerPane(props).instantiateComponent().render();
    });

    it('should have 2 children', function () {
        expect(renderedInstance.props.children.length).to.equal(2);
    });

    it('should render first player', function () {
        var player = renderedInstance.props.children[0];
        var expectedProps = {
            counting: props.counting,
            player: props.players[0],
            gestures: props.gestures,
            onGestureChange: props.onGestureChange
        };
        var actualProps = testUtils.stripChildren(player.props);
        expect(actualProps).to.eql(expectedProps);
    });

    it('should render second player', function () {
        var player = renderedInstance.props.children[1];
        var expectedProps = {
            counting: props.counting,
            player: props.players[1],
            gestures: props.gestures,
            onGestureChange: props.onGestureChange
        };
        var actualProps = testUtils.stripChildren(player.props);
        expect(actualProps).to.eql(expectedProps);
    });
});
