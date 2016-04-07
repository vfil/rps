'use strict';

var expect = require('chai').expect;
var VTag = require('../src/js/common/vdom/VTag.js');
var VDescriptor = require('../src/js/common/vdom/VDescriptor.js');
var VComponent = require('../src/js/common/vdom/VComponent.js');

describe('VTag specs:', function () {

    it('should create needed standard tag elements', function () {
        expect(
          VTag.div.prototype instanceof VDescriptor,
          'Div tag is instance of VDescriptor'
        ).to.be.true;

        expect(
          VTag.button.prototype instanceof VDescriptor,
          'Button tag is instance of VDescriptor'
        ).to.be.true;
    });
});