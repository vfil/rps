'use strict';

var expect = require('chai').expect;

var VComponent = require('../src/js/common/vdom/VComponent.js');
var VTag = require('../src/js/common/vdom/VTag.js');

describe('VTagComponent specs:', function () {

    var component,
        props,
        countClick = 0;
    beforeEach(function () {
        props = {
            className: 'active',
            onClick: function () {
                countClick++;
            }
        };
        component = VTag.div(props, 'text').instantiateComponent();
    });

    afterEach(function () {
        countClick = 0;
    });

    it('constructor creates appropriate component', function () {
        expect(component.tagName).to.equal('DIV');
    });

    it('should inherit from VComponent', function () {
        expect(component instanceof VComponent).to.be.true;
    });

    it('#computeMarkup should build html markup', function () {
        var result = component.computeMarkup('0.');
        expect(result).to.equal('<div class="active" data-uid="0.">text</div>');
    });
});
