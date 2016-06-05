'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var Judge = require('../src/js/domain/judge.js');
var LogStore = require('../src/js/domain/logStore.js');
var GuessStrategy = require('../src/js/domain/guessStrategy.js');

describe('GuessStrategy guess specs:', function () {
    var options = ['r', 'p', 's'],
        key = 'foo',
        guessStrategy,
        judge,
        logStore;
    beforeEach(function () {
        guessStrategy = GuessStrategy();
        judge = Judge();
        logStore = LogStore();
    });

    it('#guess should return random guess if no logs provided', function() {
        var spy = sinon.spy(guessStrategy, 'random');
        guessStrategy.guess(key, logStore, options, judge);
        expect(spy.calledWith(options)).to.be.true;
    });

    it('#guess should return random guess if logs length too short', function() {
        var spy = sinon.spy(guessStrategy, 'random');
        var throws = ['r', 'r', 'r', 'r'];
        recordThrows(key, throws, logStore);
        guessStrategy.guess(key, logStore, options, judge);
        expect(spy.calledWith(options)).to.be.true;
    });

    it('#guess should return random guess if shortest pattern is not found', function() {
        var spy = sinon.spy(guessStrategy, 'random');
        var throws = ['r', 'r', 'r', 'r', 'p'];
        recordThrows(key, throws, logStore);
        guessStrategy.guess(key, logStore, options, judge);
        expect(spy.calledWith(options)).to.be.true;
    });

    it('#guess should guess user gesture for next play', function() {
        var throws = ['p', 'r', 's', 'p', 'r'];
        recordThrows(key, throws, logStore);
        var gesture = guessStrategy.guess(key, logStore, options, judge);
        //from log we see that player follows r,p,s. So most likely player
        //will play next scissors, thus guessStrategy should return rock to beat it.
        expect(gesture).to.equal('r');
    });

    it('#guess should choose most probable option to play next', function() {
        var throws = ['p', 's', 'r', 'p', 's', 'p', 's', 'r', 'p', 'p', 's', 'r', 'p', 'p', 's', 'r', 'p'];
        recordThrows(key, throws, logStore);
        var gesture = guessStrategy.guess(key, logStore, options, judge);
        expect(gesture).to.equal('s');
    });

    it('#guess should return beat all gesture if algorithm computed more equal options', function() {
        var throws = ['s', 'r', 's', 'r', 'p', 'r'];
        recordThrows(key, throws, logStore);
        var gesture = guessStrategy.guess(key, logStore, options, judge);
        //from log we see that we can only guess for one length pattern - others don't repeat.
        //given that we have 1 for paper and 1 for scissors
        //scissors cut paper it is safer to play with scissors in this case.
        expect(gesture).to.equal('s');
    });

    it('#guess should choose random option if there is no possible to choose a tie or winner option from what predicted', function() {
        var spy = sinon.spy(guessStrategy, 'random');
        var throws = ['s', 'p', 's', 'p', 'r', 'p', 'p', 'r', 'p', 'r', 'r', 'p', 's', 'r', 'p'];
        recordThrows(key, throws, logStore);
        guessStrategy.guess(key, logStore, options, judge);
        expect(spy.calledWith(['s', 'r', 'p'])).to.be.true;
    });

    it('#guess should apply limit if log is too big', function() {
        //pretend player played 2 times rps pattern
        var key = 'foo';
        recordThrows(key, ['r', 'p', 's', 'r', 'p', 's'], logStore);
        //fill log with padding stuff
        var limit = 3000;
        while(limit) {
            logStore.record(key, 's');
            limit--;
        }
        //play r,p,r pattern
        recordThrows(key, ['r', 'p', 'r', 'r', 'p'], logStore);
        var gesture = guessStrategy.guess(key, logStore, options, judge, 1);
        //normally guess should be rock to beat scissors, but logs where cut so
        expect(gesture).to.equal('p');
    });
});

function recordThrows(key, throws, logStore) {
    throws.forEach(function (log) {
        logStore.record(key, log);
    });
}
