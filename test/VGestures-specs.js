'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils.js');
var VGestures = require('../src/js/components/VGestures.js');

describe('VGestures specs - Human, game - idle:', function () {
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
                gesture: 'rock'
            },
            counting: false
        };
        renderedInstance = VGestures(props).instantiateComponent().render();
    });
    it('should have gesture buttons', function () {
        expect(
          renderedInstance.props.children.length,
          'has three children'
        ).to.equal(3);
        var expectedRockProps = {
            active: true,
            playerName: 'Foo',
            gesture: 'rock',
            human: true,
            onGestureChange: onGestureChange
        };
        var rockProps = testUtils.stripChildren(renderedInstance.props.children[0].props);
        expect(
          rockProps,
          'rock gesture is set'
        ).to.eql(expectedRockProps);

        var expectedPaperProps = {
            active: false,
            playerName: 'Foo',
            gesture: 'paper',
            human: true,
            onGestureChange: onGestureChange
        };
        var paperProps = testUtils.stripChildren(renderedInstance.props.children[1].props);
        expect(
          paperProps,
          'paper gesture is set'
        ).to.eql(expectedPaperProps);

        var expectedScissorsProps = {
            active: false,
            playerName: 'Foo',
            gesture: 'scissors',
            human: true,
            onGestureChange: onGestureChange
        };
        var scissorsProps = testUtils.stripChildren(renderedInstance.props.children[2].props);
        expect(
          scissorsProps,
          'scissors gesture is set'
        ).to.eql(expectedScissorsProps);
    });
});

describe('VGestures specs - Computer, game - idle:', function () {
    var props,
        renderedInstance,
        onGestureChange = new Function();
    beforeEach(function () {
        props = {
            onGestureChange: onGestureChange,
            gestures: ['rock', 'paper', 'scissors'],
            player: {
                isHuman: false,
                name: 'Wally',
                gesture: 'rock'
            },
            counting: false
        };
        renderedInstance = VGestures(props).instantiateComponent().render();
    });
    it('should have gesture buttons', function () {
        expect(
          renderedInstance.props.children.length,
          'has three children'
        ).to.equal(3);
        var expectedRockProps = {
            active: true,
            playerName: 'Wally',
            gesture: 'rock',
            human: false,
            onGestureChange: onGestureChange
        };
        var rockProps = testUtils.stripChildren(renderedInstance.props.children[0].props);
        expect(
          rockProps,
          'rock gesture is set'
        ).to.eql(expectedRockProps);

        var expectedPaperProps = {
            active: false,
            playerName: 'Wally',
            gesture: 'paper',
            human: false,
            onGestureChange: onGestureChange
        };
        var paperProps = testUtils.stripChildren(renderedInstance.props.children[1].props);
        expect(
          paperProps,
          'paper gesture is set'
        ).to.eql(expectedPaperProps);

        var expectedScissorsProps = {
            active: false,
            playerName: 'Wally',
            gesture: 'scissors',
            human: false,
            onGestureChange: onGestureChange
        };
        var scissorsProps = testUtils.stripChildren(renderedInstance.props.children[2].props);
        expect(
          scissorsProps,
          'scissors gesture is set'
        ).to.eql(expectedScissorsProps);
    });
});

describe('VGestures specs - Computer, game - counting:', function () {
    var props,
        renderedInstance,
        onGestureChange = new Function();
    beforeEach(function () {
        props = {
            onGestureChange: onGestureChange,
            gestures: ['rock', 'paper', 'scissors'],
            player: {
                isHuman: false,
                name: 'Wally',
                gesture: 'rock'
            },
            counting: true
        };
        renderedInstance = VGestures(props).instantiateComponent().render();
    });
    it('should have gesture buttons', function () {
        expect(
          renderedInstance.props.children.length,
          'has three children'
        ).to.equal(3);
        var expectedRockProps = {
            active: false,
            playerName: 'Wally',
            gesture: 'rock',
            human: false,
            onGestureChange: onGestureChange
        };
        var rockProps = testUtils.stripChildren(renderedInstance.props.children[0].props);
        expect(
          rockProps,
          'rock gesture is set'
        ).to.eql(expectedRockProps);

        var expectedPaperProps = {
            active: false,
            playerName: 'Wally',
            gesture: 'paper',
            human: false,
            onGestureChange: onGestureChange
        };
        var paperProps = testUtils.stripChildren(renderedInstance.props.children[1].props);
        expect(
          paperProps,
          'paper gesture is set'
        ).to.eql(expectedPaperProps);

        var expectedScissorsProps = {
            active: false,
            playerName: 'Wally',
            gesture: 'scissors',
            human: false,
            onGestureChange: onGestureChange
        };
        var scissorsProps = testUtils.stripChildren(renderedInstance.props.children[2].props);
        expect(
          scissorsProps,
          'scissors gesture is set'
        ).to.eql(expectedScissorsProps);
    });
});
