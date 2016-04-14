'use strict';
var expect = require('chai').expect;
var counter = require('../src/js/domain/counter.js');

describe('Counter specs:', function () {
    //TODO unreliable, think about it.
    it('Counter should call callback function at specific interval', function (done) {
        var counts = [1, 2, 3];
        var countInterval = 200;
        var actual = [];
        function count_cb(count) {
            actual.push({
                val: count,
                time: new Date()
            });
        }
        function end_cb() {
            actual.push({
                val: 'end',
                time: new Date()
            });
            var zero = actual[0].time;
            var relative = actual.map(function (item) {
                return {
                    val: item.val,
                    time: item.time - zero
                }
            });

            //check if first callback was called approximately instantly
            expect(
              isApproximate(actual[0].time, startTime, 20),
              'Count callback is called at right interval'
            ).to.be.true;

            var expectedCallList = counts.concat('end');
            relative.forEach(function (item, index) {
                //TODO hardly reliable (((.
                expect(
                  isApproximate(item.time, countInterval * index, 20),
                  'Count callback is called at right interval'
                ).to.be.true;
                expect(
                  item.val,
                  'Count callback is called with right params'
                ).to.equal(expectedCallList[index]);
            });
            done();
        }
        var startTime = new Date().getTime();
        counter(counts, countInterval, count_cb, end_cb);
    });
});

function isApproximate(actual, expected, inRange) {
    return expected - inRange < actual && actual < expected + inRange
}