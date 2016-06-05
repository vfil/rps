'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils.js');
var VPlayerLog = require('../src/js/components/VPlayerLog.js');

describe('VPlayerLog specs:', function () {

    it('should render gesture right oriented', function () {
        var props = {
            index: 0,
            gesture: 'rock',
            isWinner: true
        };
        var renderedInstance = VPlayerLog(props).instantiateComponent().render();
        var className = renderedInstance.props.className;
        expect(testUtils.containsClass(className, 'icon-rock')).to.be.true;
        expect(testUtils.containsClass(className, 'winner')).to.be.true;
    });

    it('should render left oriented', function () {
        var props = {
            index: 1,
            gesture: 'rock',
            isWinner: false
        };
        var renderedInstance = VPlayerLog(props).instantiateComponent().render();
        var className = renderedInstance.props.className;
        expect(testUtils.containsClass(className, 'icon-rock-m')).to.be.true;
        expect(testUtils.containsClass(className, 'winner')).to.be.false;
    });

});
