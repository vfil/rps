'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var testUtils = require('./testUtils.js');
var Vtag = require('../src/js/common/vdom/VTag.js');
var VGesture = require('../src/js/components/VGesture.js');

describe('VGesture specs:', function () {
    var props,
        renderedInstance;
    beforeEach(function () {
        props = {
            playerName: 'Dummy Name',
            gesture: 'rock',
            onGestureChange: new Function(),
            human: true,
            active: true
        };
        renderedInstance = VGesture(props).instantiateComponent().render();
    });
    it('should render a button', function () {
        expect(
          renderedInstance.props.children.length,
          'has one child'
        ).to.equal(1);
        expect(
          renderedInstance.props.children[0] instanceof Vtag.button,
          'is a button'
        ).to.be.true;
        var button = renderedInstance.props.children[0];
        var className = button.props.className;
        expect(testUtils.containsClass(className, 'punch')).to.be.true;
        expect(testUtils.containsClass(className, 'human')).to.be.true;
        expect(testUtils.containsClass(className, 'active')).to.be.true;
    });

    it('should handle click events', function () {
        var button = renderedInstance.props.children[0];
        var spy = sinon.spy(props, 'onGestureChange');
        button.props.onClick();
        expect(spy.calledWith(props.playerName, props.gesture)).to.equal(true);
    });
});
