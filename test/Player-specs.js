'use strict';

var expect = require('chai').expect;

var Player = require('../src/js/domain/player.js');

describe('Player specs:', function () {

    var player;
    beforeEach(function() {
        player = new Player('Bob', true);
    });

    it("#getName() should return player's name", function () {
        expect(player.getName(), 'Player returned wrong name')
          .to.equal('Bob');
    });

    it("#setGesture() should set player's gesture", function () {
        player.setGesture('spock');
        expect(player.getGesture()).to.equal('spock');
    });

    it("#isHuman() should show if player is human", function () {
        expect(player.isHuman()).to.equal(true);
    });

    it('#incrementWins should increment wins', function () {
        player.incrementWins();
        expect(player.getWins()).to.equal(1);
    });
});
