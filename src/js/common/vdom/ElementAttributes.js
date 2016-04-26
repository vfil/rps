'use strict';

/**
 * Element Attribute rules.
 * Serves for checking whether prop should be turned into Element Attribute.
 * @module vdom/ElementAttributes
 */

module.exports = {
    /**
     * Custom attribute name which maps Component to rendered Element
     * @type {string}
     * @readonly
     */
    UID_ATTR_NAME: 'data-uid',
    /**
     * List of props that turns into standard element attributes.
     * Extend if needed.
     * @readonly
     */
    isStandardAttribute: {
        className: true
    },
    /**
     * Map of props to element attributes.
     * @readonly
     */
    attributeNames: {
        className: 'class'
    },
    /**
     * Serves as separator for nested elements uid
     * @type {string}
     */
    ATTR_SEPARATOR: '.'
};
