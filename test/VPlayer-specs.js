'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils.js');
var utils = require('../src/js/common/utils.js');
var VPlayer = require('../src/js/components/VPlayer.js');

describe('VPlayer specs:', function () {
    var props,
        renderedInstance,
        onGestureChange = new Function();
    beforeEach(function () {
        props = {
            onGestureChange: onGestureChange,
            gestures: ['rock', 'paper', 'scissors'],
            player: {
                isHuman: true,
                name: 'Foo',
                gesture: 'rock',
                wins: 3,
                gameWins: 1
            },
            counting: false
        };
        renderedInstance = VPlayer(props).instantiateComponent().render();
    });

    it('should have 3 children', function () {
        expect(renderedInstance.props.children.length).to.equal(3);
    });

    it('should render player name', function () {
        var name = renderedInstance.props.children[0];
        expect(name.props.children).to.equal(props.player.name);
    });

    it('should render player wins', function () {
        var wins = renderedInstance.props.children[1];
        expect(wins.props.children).to.equal(props.player.gameWins);
    });

    it('should render gestures', function () {
        var gestures = renderedInstance.props.children[2];
        var expectedProps = {
            counting: props.counting,
            player: props.player,
            gestures: props.gestures,
            onGestureChange: props.onGestureChange
        };

        var actualProps = testUtils.stripChildren(gestures.props);
        expect(actualProps).to.eql(expectedProps);
    });

    it('should not pass gesture change handler if player is not human', function () {
        props.player.isHuman = false;
        renderedInstance = VPlayer(props).instantiateComponent().render();
        var gestures = renderedInstance.props.children[2];
        var expectedProps = {
            counting: props.counting,
            player: props.player,
            gestures: props.gestures,
            onGestureChange: utils.noop
        };

        var actualProps = testUtils.stripChildren(gestures.props);
        expect(actualProps).to.eql(expectedProps);
    });
});
