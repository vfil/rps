'use strict';

var utils = require('../utils.js');

/**
 * Represents an descriptor for VComponent which take care of heavy lifting behind
 * VComponent and DOM interactions.
 * @class
 * @constructor
 */
/* istanbul ignore next */
var VDescriptor = function () {};

/**
 * Creates a factory function for creating VDescriptor instances for VComponents.
 * @param {Function} type - a Constructor function with a 'construct' function for object initialization,
 * as usual a child of VComponent or VTagComponent.
 * @returns {Function} factory - given props and children as arguments returns a VDescriptor for VComponent.
 */
//Is it ok to put fields on functions? Babel does so for syntactical sugar es6 classes static methods.
//Heard a lot of complains but no reasons, at the end function is an object.
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

/**
 * Instantiates linked VComponent.
 * @returns {VComponent}
 */
VDescriptor.prototype.instantiateComponent = function () {
    return new this.type(this);
};

/**
 * Clones a VDescriptor instance and replaces props.
 * @param {VDescriptor} oldDescriptor - Descriptor before receiving new props
 * @param {object} newProps - new props to update current descriptor
 * @returns {VDescriptor}
 */
VDescriptor.cloneAndReplaceProps = function (oldDescriptor, newProps) {
    var newDescriptor = Object.create(oldDescriptor.constructor.prototype);
    newDescriptor.props = newProps;
    return newDescriptor;
};

module.exports = VDescriptor;