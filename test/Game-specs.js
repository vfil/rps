var expect = require('chai').expect;

describe('Game specs:', function () {

    it('#play()', function () {
        var game = Game();
        game.play();
        expect(game.getWinner(), 'Game returned wrong winner')
          .to.equal('Player1 wins!!!');
    })
});
