'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var EventEmitter = require('../src/js/common/eventEmitter.js');

describe('EventEmitter specs:', function () {

    var emitter;
    beforeEach(function () {
        emitter = EventEmitter();
    });

    it("should subscribe to events and emit events", function (done) {
        var expectedMessage = {status: 'ok'};

        emitter.on('dummyEvent', function (message) {
            expect(message).to.eql(expectedMessage);
            done();
        });
        emitter.emit('dummyEvent', expectedMessage);
    });

    it("should unsubscribe properly", function () {
        var spy = sinon.spy();

        var subscriber = emitter.on('event', spy);
        emitter.emit('event', {});

        subscriber();
        emitter.emit('event', {});
        expect(spy.callCount).to.equal(1);
    });

    it("should delete only needed listener even if unsubsribe is called multiple times", function () {
        var calls = 0;
        var subscriber1 = emitter.on('dummyEvent', function first() {
            calls++
        });
        var subscriber2 = emitter.on('dummyEvent', function second() {
            calls++
        });

        var subscriber3 = emitter.on('dummyEvent2', function third() {
            calls++
        });
        var subscriber4 = emitter.on('dummyEvent3', function four() {
            calls++
        });


        emitter.emit('dummyEvent', {});

        subscriber1();
        subscriber1();
        subscriber1();

        emitter.emit('dummyEvent', {});
        expect(calls).to.equal(3);

        subscriber2();
        emitter.emit('dummyEvent', {});
        expect(calls).to.equal(3);
    });
});