'use strict';

var expect = require('chai').expect;
var VRoundScore = require('../src/js/components/VRoundScore.js');

describe('VRoundScore specs:', function () {
    var props,
        renderedInstance;
    beforeEach(function () {
        props = {
            leftScore: 0,
            rightScore: 1
        };
        renderedInstance = VRoundScore(props).instantiateComponent().render();
    });

    it('should have 3 children', function () {
        expect(renderedInstance.props.children.length).to.equal(3);
    });

    it('should render left score', function () {
        var score = renderedInstance.props.children[0].props.children;
        expect(score).to.eql(props.leftScore);
    });

    it('should render right score', function () {
        var score = renderedInstance.props.children[2].props.children;
        expect(score).to.eql(props.rightScore);
    });

    it('should render separator for the score', function () {
        var score = renderedInstance.props.children[1].props.children;
        expect(score).to.eql(':');
    });
});
