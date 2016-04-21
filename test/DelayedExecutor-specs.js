'use strict';

var expect = require('chai').expect;
var delayedExecutor = require('../src/js/delayedExecutor.js');

describe('DelayedExecutor specs:', function () {
    //TODO unreliable, think about it.
    it('Counter should call callback function at specific interval', function (done) {
        var countInterval = 100;
        var args = ['arg1', 'arg2'];
        function func() {
            expect(
              isApproximate(new Date().getTime(), startTime + countInterval, 50),
              'callback is called at approximate right interval'
            ).to.be.true;
            expect(
              Array.prototype.slice.call(arguments),
              'Callback is called with right arguments'
            ).to.eql(args);
            done();
        }
        var startTime = new Date().getTime();
        delayedExecutor(func, countInterval, args);
    });
});

function isApproximate(actual, expected, inRange) {
    return expected - inRange < actual && actual < expected + inRange
}
