'use strict';

var utils = require('../utils.js');

/**
 * Represents an encapsulation of VComponent which take care of heavy lifting behind
 * VComponent and DOM interactions.
 * @class
 * @constructor
 */
var VDescriptor = function () {};

/**
 * Creates a factory function for creating VDescriptor instances for VComponents.
 * @param {Function} type - a Constructor function with a 'construct' function for object initialization,
 * as usual a child of VComponent or VTagComponent.
 * @returns {Function} factory - given props and children as arguments returns a VDescriptor for VComponent.
 */
//TODO maybe inheritance chain can be optimized???
VDescriptor.createFactory = function (type) {

    //create fresh prototype for each factory and descriptor,
    // as type of descriptor is saved on prototype for later initialization.
    var descriptorPrototype = Object.create(VDescriptor.prototype);
    descriptorPrototype.type = type;

    var factory = function (props, children) {

        //provide empty object as default props if null, as it has to be populated with children.
        if (props == null) {
            props = {};
        }

        props.children = children;


        // Initialize the descriptor object
        var descriptor = Object.create(descriptorPrototype);

        descriptor.props = props;

        return descriptor;
    };


    factory.prototype = descriptorPrototype;

    descriptorPrototype.constructor = factory;

    return factory;

};

VDescriptor.prototype.instantiateComponent = function () {
    return new this.type(this);
};

VDescriptor.cloneAndReplaceProps = function (oldDescriptor, newProps) {
    var newDescriptor = Object.create(oldDescriptor.constructor.prototype);
    newDescriptor.props = newProps;
    return newDescriptor;
};

module.exports = VDescriptor;