'use strict';

var expect = require('chai').expect;
var VInfo = require('../src/js/components/VInfo.js');

describe('VInfo specs:', function () {
    var props,
        renderedInstance;
    beforeEach(function () {
        props = {
            message: 'test message',
            hint: 'test hint'
        };
        renderedInstance = VInfo(props).instantiateComponent().render();
    });

    it('should have 2 children', function () {
        expect(renderedInstance.props.children.length).to.equal(2);
    });

    it('should render message', function () {
        var message = renderedInstance.props.children[0];
        expect(message.props.children).to.eql(props.message);
    });

    it('should render hint', function () {
        var hint = renderedInstance.props.children[1];
        expect(hint.props.children).to.eql(props.hint);
    });
});
