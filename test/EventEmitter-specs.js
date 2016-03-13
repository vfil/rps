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

        var subscriber = emitter.on('dummyEvent', spy);
        emitter.emit('dummyEvent', {});

        subscriber();
        emitter.emit('dummyEvent', {});
        expect(spy.callCount).to.equal(1);
    });

    it("should delete only needed listener even if unsubsribe is called multiple times", function () {
        var calls = 0;
        var subscriber1 = emitter.on('dummyEvent', function () {
            calls++
        });
        var subscriber2 = emitter.on('dummyEvent', function () {
            calls++
        });
        emitter.emit('dummyEvent', {});

        subscriber2();
        subscriber2();
        subscriber2();

        emitter.emit('dummyEvent', {});
        expect(calls).to.equal(3);

        subscriber1();
        emitter.emit('dummyEvent', {});
        expect(calls).to.equal(3);
    });
});