'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils.js');
var VInfoPane = require('../src/js/components/VInfoPane.js');

describe('VInfoPane specs:', function () {
    var props,
        renderedInstance;
    beforeEach(function () {
        props = {
            leftScore: 0,
            rightScore: 1,
            logs: {},
            info: {
                message: 'test message',
                hint: 'test hint'
            }
        };
        //extract instance from wrapper
        renderedInstance = VInfoPane(props).instantiateComponent().render().props.children[0];
    });

    it('should have 3 children', function () {
        expect(renderedInstance.props.children.length).to.equal(3);
    });

    it('should render info', function () {
        var info = renderedInstance.props.children[0];
        var actualResult = testUtils.stripChildren(info.props);
        expect(actualResult).to.eql(props.info);
    });

    it('should render round score', function () {
        var score = renderedInstance.props.children[1];
        var actualResult = testUtils.stripChildren(score.props);
        expect(actualResult).to.eql({
            leftScore: 0,
            rightScore: 1
        });
    });

    it('should render logs', function () {
        var logs = renderedInstance.props.children[2];
        expect(logs.props.logs).to.equal(props.logs);
    });
});
