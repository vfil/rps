'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils.js');
var VRoundLogs = require('../src/js/components/VRoundLogs.js');

describe('VRoundLogs specs:', function () {

    it('should render logs', function () {
        var props = {
            logs: [{}, {}]
        };
        var renderedInstance = VRoundLogs(props).instantiateComponent().render();

        var firstLog = renderedInstance.props.children[0];
        var expectedProps = {
            index: 0,
            log: props.logs[0]
        };
        var actualProps = testUtils.stripChildren(firstLog.props);
        expect(actualProps).to.eql(expectedProps);

        var secondLog = renderedInstance.props.children[1];
        expectedProps = {
            index: 1,
            log: props.logs[1]
        };
        actualProps = testUtils.stripChildren(secondLog.props);
        expect(actualProps).to.eql(expectedProps);
    });
});
