'use strict';

var expect = require('chai').expect;

var VTag = require('../src/js/common/vdom/VTag.js');
var VComponent = require('../src/js/common/vdom/VComponent.js');

describe('VComponent specs:', function () {

    var render,
        component,
        descriptor,
        props = {foo: 'bar'};

    beforeEach(function () {
        render = function () {
            return VTag.div(null, [VTag.div(null)]);
        };

        var factory = VComponent.createClass({render: render});

        descriptor = factory(props);

        component = descriptor.instantiateComponent();
    });

    it('#createClass should create a component factory', function () {
        expect(
          component instanceof VComponent,
          'is instance of VComponent'
        ).to.be.true;
        expect(
          component.render === render,
          'is a mixin with provided render method'
        ).to.be.true;
    });

    it('#createClass should throw an error if provided spec is not valid', function () {
        var wrapperFn = function () {
            VComponent.createClass({render: null});
        };
        expect(
          wrapperFn,
          'spec should provide a render method'
        ).to.throw(Error);
    });

    it('#construct should initialize component', function () {
        expect(
          component.props.foo,
          'props are populated'
        ).to.equal(props.foo);
        expect(
          component._descriptor,
          'descriptor saved as property of component'
        ).to.equal(descriptor);
    });

    it('#getMarkup ', function () {
        var markup = component.getMarkup('.0');
        expect(markup).to.equal('<div data-uid=".0"><div data-uid=".0.0"></div></div>');
    });
});
