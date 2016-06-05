'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var lolex = require('lolex');
var delayedExecutor = require('../src/js/delayedExecutor.js');

describe('DelayedExecutor specs:', function () {
    it('Counter should call callback function at specific interval', function () {
        var clock = lolex.install();
        var countInterval = 100;
        var args = ['arg1', 'arg2'];
        var spy = sinon.spy();
        delayedExecutor(spy, countInterval, args);
        clock.tick(101);
        expect(spy.args[0]).to.eql(args);
    });
});
