'use strict';

var utils = require('../utils.js');
var VTagComponent = require('./VTagComponent');
var VDescriptor = require('./VDescriptor');

/**
 * Container for standard HTML tags wrapped in VDescriptors.
 * @module vdom/VTags
 */
var VTags = utils.generateDynamicProps({
    div: false,
    button: true
}, createVTagComponent);

function createVTagComponent(tag) {

    var Constructor = function (descriptor) {
        this.construct(descriptor);
    };
    Constructor.prototype = new VTagComponent(tag);
    Constructor.prototype.constructor = Constructor;
    Constructor.displayName = tag;

    return VDescriptor.createFactory(Constructor);
}

module.exports = VTags;