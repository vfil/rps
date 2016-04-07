'use strict';

var expect = require('chai').expect;
var VDescriptor = require('../src/js/common/vdom/VDescriptor.js');
var VComponent = require('../src/js/common/vdom/VComponent.js');

describe('VDescriptor specs:', function () {

    var factory,
      descriptor,
      props = {foo: 'bar'};

    beforeEach(function () {
        var Constructor = function (props) {
            this.construct(props);
        };
        Constructor.prototype = new VComponent();
        Constructor.prototype.constructor = Constructor;

        factory = VDescriptor.createFactory(Constructor);
        descriptor = factory(props);
    });

    it('#createFactory should create a descriptor factory which uses provided props', function () {
        expect(
          factory.prototype instanceof VDescriptor,
          'factory prototype is instance of VDescriptor'
        ).to.be.true;

        expect(
          descriptor instanceof VDescriptor,
          'descriptor is instance of VDescriptor'
        );

        expect(
          descriptor.props.foo,
          'uses provided props'
        ).to.equal(props.foo);
    });

    it('#instantiateComponent should create a provided component type', function () {
        expect(
          descriptor.instantiateComponent() instanceof VComponent,
          'created component should be of right type'
        ).to.be.true;
    });
});