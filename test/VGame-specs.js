'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils.js');
var VGame = require('../src/js/components/VGame.js');

describe('VGame specs:', function () {
    var props,
        renderedInstance,
        onGestureChange = new Function();
    beforeEach(function () {
        props = {
            changeGesture: onGestureChange,
            gestures: ['rock', 'paper', 'scissors'],
            leftPane: [
                {
                    isHuman: false,
                    name: 'Wally',
                    gesture: 'rock',
                    wins: 0
                }
            ]
            ,
            rightPane: [
                {
                    isHuman: true,
                    name: 'Foo',
                    gesture: 'paper',
                    wins: 3
                }
            ]
            ,
            counting: false,
            info: {
                message: 'test message',
                hint: 'test hint'
            },
            logs: {}
        };
        renderedInstance = VGame(props).instantiateComponent().render();
    });

    it('should have 2 children', function () {
        expect(renderedInstance.props.children.length).to.equal(3);
    });

    it('should render leftPane', function () {
        var leftPane = renderedInstance.props.children[0];
        var expectedProps = {
            counting: props.counting,
            players: props.leftPane,
            gestures: props.gestures,
            onGestureChange: props.changeGesture
        };
        var actualProps = testUtils.stripChildren(leftPane.props);
        expect(actualProps).to.eql(expectedProps);
    });

    it('should render rightPane', function () {
        var rightPane = renderedInstance.props.children[2];
        var expectedProps = {
            counting: props.counting,
            players: props.rightPane,
            gestures: props.gestures,
            onGestureChange: props.changeGesture,
            mirror: true
        };
        var actualProps = testUtils.stripChildren(rightPane.props);
        expect(actualProps).to.eql(expectedProps);
    });

    it('should render InfoPane', function () {
        var info = renderedInstance.props.children[1];
        var expectedProps = {
            leftScore: 0,
            rightScore: 3,
            info: props.info,
            logs: props.logs
        };
        var actualProps = testUtils.stripChildren(info.props);
        expect(actualProps).to.eql(expectedProps);
    });
});
