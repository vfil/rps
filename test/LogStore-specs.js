'use strict';

var expect = require('chai').expect;
var LogStore = require('../src/js/domain/logStore.js');

describe('LogStore specs:', function () {

    it('#record should record gesture for player', function () {
        var logStore = LogStore();
        logStore.record('p1', 'rock');
        logStore.record('p1', 'paper');
        logStore.record('p2', 'paper');
        logStore.record('p2', 'rock');
        expect(logStore.getLogs('p1')).to.eql(['rock', 'paper']);
        expect(logStore.getLogs('p2')).to.eql(['paper', 'rock']);
    });
});
