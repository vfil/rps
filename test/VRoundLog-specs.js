'use strict';

var expect = require('chai').expect;
var VRoundLog = require('../src/js/components/VRoundLog.js');

describe('VRoundLog specs:', function () {

    it('should render right arrow when left player wins', function () {
        var props = {
            log: [
                {
                    isWinner: true
                },
                {
                    isWinner: false
                }
            ]
        };
        var renderedInstance = VRoundLog(props).instantiateComponent().render();
        var arrow = renderedInstance.props.children[1];
        expect(arrow.props.className).to.equal('icon-arrow-right');
    });

    it('should render right arrow when left player wins', function () {
        var props = {
            log: [
                {
                    isWinner: false
                },
                {
                    isWinner: true
                }
            ]
        };
        var renderedInstance = VRoundLog(props).instantiateComponent().render();
        var arrow = renderedInstance.props.children[1];
        expect(arrow.props.className).to.equal('icon-arrow-left');
    });

    it('should render right arrow when left player wins', function () {
        var props = {
            log: [
                {
                    isWinner: false
                },
                {
                    isWinner: false
                }
            ]
        };
        var renderedInstance = VRoundLog(props).instantiateComponent().render();
        var arrow = renderedInstance.props.children[1];
        expect(arrow.props.className).to.equal('icon-repeat');
    });
});
