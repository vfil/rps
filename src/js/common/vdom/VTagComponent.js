'use strict';

var utils = require('../utils.js');
var VDOM = require('./VDOM.js');
var VComponent = require('./VComponent.js');
var ElementAttributes = require('./ElementAttributes.js');

var CONTENT_TYPES = {'string': true, 'number': true};

var listenersTypes = {
    onClick: 'click',
    onMouseMove: 'mousemove'
};

/**
 * Component for standard HTML tags.
 * see VTag module comes with a set of descriptors which inherits this class.
 * @class
 * @param {string} tag - String which someone would provide to document.createElement.
 * @constructor
 */
var VTagComponent = function (tag) {
    this._tagOpen = '<' + tag + ' ';
    this._tagClose = '</' + tag + '>';
    this.tagName = tag.toUpperCase();
};

//In fact is also an VComponent which overrides some behaviour
VTagComponent.prototype = Object.create(VComponent.prototype);

/**
 * Computes component markup
 * @param {string} uid - element internal attribute value
 * @returns {string}
 */
VTagComponent.prototype.computeMarkup = function (uid) {
    this._uid = uid;
    return (
      this._createOpenTagMarkupAndPutListeners() +
      this._createContentMarkup() +
      this._tagClose
    );
};

/**
 * Updates component representation.
 * Note: new props are already set to component.
 * @param {VDescriptor} prevDescriptor - previous component descriptor.
 */
VTagComponent.prototype.updateComponent = function (prevDescriptor) {
    this._updateDOMAttributes(prevDescriptor.props);
    this._updateDOMChildren(prevDescriptor.props);
};

/**
 * Removes component and all his descendants.
 */
VTagComponent.prototype.removeComponent = function () {
    this._removeChildren();
    VDOM.deleteAllListeners(this._uid);
};

/**
 * Creates markup for the open tag and all attributes.
 * @private
 * @return {string}
 */
VTagComponent.prototype._createOpenTagMarkupAndPutListeners = function () {
    var props = this.props;
    var accumulator = this._tagOpen;

    for (var propKey in props) {
        /* istanbul ignore else */
        if (props.hasOwnProperty(propKey)) {
            var propValue = props[propKey];
            if (propValue != null) {
                if (listenersTypes.hasOwnProperty(propKey)) {
                    this._registerListener(this._uid, listenersTypes[propKey], propValue);
                } else {
                    var markup = this._createMarkupForAttribute(propKey, propValue);
                    if (markup) {
                        accumulator += markup + ' ';
                    }
                }
            }
        }
    }

    var markupForID = ElementAttributes.UID_ATTR_NAME + '="' + this._uid + '"';

    return accumulator + markupForID + '>';
};

/**
 * Creates markup for a tag attribute.
 * @private
 * @param {string} name - attribute name.
 * @param {string} value - attribute value.
 * @return {?string} string, or null if the property was invalid.
 */
VTagComponent.prototype._createMarkupForAttribute = function (name, value) {
    if (ElementAttributes.isStandardAttribute[name]) {
        var attributeName = ElementAttributes.attributeNames[name];
        return utils.escapeTextForBrowser(attributeName) +
          '="' + utils.escapeTextForBrowser(value) + '"';
    }
    return null;
};

/**
 * Generates markup which represents children nodes.
 * @private
 * @returns {string}
 */
VTagComponent.prototype._createContentMarkup = function () {
    var contentToUse;
    if (typeof this.props.children === 'string' || typeof this.props.children === 'number') {
        contentToUse = this.props.children;
        return utils.escapeTextForBrowser(contentToUse);
    } else {
        var childrenMarkup = this._computeChildrenMarkup(this.props.children);
        return childrenMarkup.join('');
    }
};

/**
 * Computes children DOMElements markup
 * @param {Array.<VComponent>} nestedChildren - component children.
 * @returns {Array.<string>}
 * @private
 */
VTagComponent.prototype._computeChildrenMarkup = function (nestedChildren) {
    var children = this._childrenToMap(nestedChildren);
    var childrenMarkup = [];
    var index = 0;
    this._renderedChildren = children;
    for (var name in children) {
        /* istanbul ignore else */
        if (children.hasOwnProperty(name)) {
            var childDescriptor = children[name];
            var childComponent = childDescriptor.instantiateComponent();
            children[name] = childComponent;
            var uid = this._uid + name;
            var childMarkup = childComponent.computeMarkup(uid, this._depth + 1);
            childComponent._appendIndex = index;
            childrenMarkup.push(childMarkup);
            index++;
        }
    }
    return childrenMarkup;
};

/**
 * Register an event handler for given component
 * @param {string} uid - UID of component
 * @param {string} eventType - standard DOM event type string
 * @param {function} listener - event handler.
 * @private
 */
VTagComponent.prototype._registerListener = function (uid, eventType, listener) {
    VDOM.addListener(this._uid, eventType, listener);
};

/**
 * Updates component attributes.
 * @param {object} lastProps - previous props object.
 * @private
 */
VTagComponent.prototype._updateDOMAttributes = function (lastProps) {
    var nextProps = this.props;
    var propKey;
    for (propKey in nextProps) {
        var nextProp = nextProps[propKey];
        var lastProp = lastProps[propKey];
        if (nextProps.hasOwnProperty(propKey) && nextProp !== lastProp) {
            if (listenersTypes.hasOwnProperty(propKey)) {
                this._registerListener(this._uid, listenersTypes[propKey], nextProp);
            } else if (ElementAttributes.isStandardAttribute[propKey]) {
                VDOM.updateAttributeByID(this._uid, propKey, nextProp);
            }
        }
    }
};

/**
 * Updates children nodes of component
 * @param {object} lastProps - previous props object.
 * @private
 */
VTagComponent.prototype._updateDOMChildren = function (lastProps) {
    var nextProps = this.props;

    var lastContent =
      CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
    var nextContent =
      CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;

    var nextChildren = nextContent != null ? null : nextProps.children;

    if (nextContent != null && lastContent !== nextContent) {
        this._updateTextContent('' + nextContent);
    } else if (nextChildren != null) {
        this._updateChildren(nextChildren);
    }
};

/**
 * Updates composite children of component
 * @param {Array.<VDescriptor>} nextNestedChildren
 * @private
 */
VTagComponent.prototype._updateChildren = function (nextNestedChildren) {
    var nextChildren = this._childrenToMap(nextNestedChildren);
    var prevChildren = this._renderedChildren;
    var relativeUID;
    var lastIndex = 0;
    var nextIndex = 0;
    for (relativeUID in nextChildren) {
        /* istanbul ignore else */
        if (nextChildren.hasOwnProperty(relativeUID)) {
            var prevChild = prevChildren && prevChildren[relativeUID];
            var prevDescriptor = prevChild && prevChild._descriptor;
            var nextDescriptor = nextChildren[relativeUID];
            if (this._shouldUpdate(prevDescriptor, nextDescriptor)) {
                lastIndex = Math.max(prevChild._appendIndex, lastIndex);
                prevChild.performUpdate(nextDescriptor);
                prevChild._appendIndex = nextIndex;
            } else {
                var nextChildInstance = nextDescriptor.instantiateComponent();
                this._insertChildByNameAtIndex(nextChildInstance, relativeUID, nextIndex);
            }
            nextIndex++;
        }
    }
    // Remove children
    for (relativeUID in prevChildren) {
        if (prevChildren.hasOwnProperty(relativeUID) && !(nextChildren && nextChildren[relativeUID])) {
            this._removeChildByName(prevChildren[relativeUID], relativeUID);
        }
    }
    VDOM.processQueue();
};

/**
 * Inserts a node at index
 * @param {VComponent} child - component to be inserted.
 * @param {string} uid - UID of component.
 * @param {number} index - at which index.
 * @private
 */
VTagComponent.prototype._insertChildByNameAtIndex = function (child, uid, index) {
    var rootID = this._uid + uid;
    var childMarkup = child.computeMarkup(rootID, this._depth + 1);
    child._appendIndex = index;
    this._renderedChildren[uid] = child;
    VDOM.enqueueMarkup(this._uid, childMarkup, child._appendIndex);
};

/**
 * Recursively removes children components.
 * @private
 */
VTagComponent.prototype._removeChildren = function () {
    var renderedChildren = this._renderedChildren;
    for (var relativeID in renderedChildren) {
        var renderedChild = renderedChildren[relativeID];
        renderedChild.removeComponent();
    }
    this._renderedChildren = null;
};

/**
 * Removes child and descendants.
 * @param {VComponent} child - component to be removed.
 * @param {string} relativeUID - a relative id calculated based on parent id.
 * @private
 */
VTagComponent.prototype._removeChildByName = function (child, relativeUID) {
    VDOM.enqueueRemove(this._uid, child._appendIndex);
    child._appendIndex = null;
    child.removeComponent();
    delete this._renderedChildren[relativeUID];
};

/**
 * Updates text node component
 * @param nextContent
 * @private
 */
VTagComponent.prototype._updateTextContent = function (nextContent) {
    VDOM.enqueueTextContent(this._uid, nextContent);
    VDOM.processQueue();
};

/**
 * Reduces an array of children component to a map with relative to parent UID as keys.
 * @param {VDescriptor} children
 * @returns {object}
 * @private
 */
VTagComponent.prototype._childrenToMap = function(children) {
    if (children == null) {
        return children;
    }

    return children.reduce(function (acc, nextChildFactory, index) {
        acc[ElementAttributes.ATTR_SEPARATOR + index] = nextChildFactory;
        return acc;
    }, {});
};

VTagComponent.prototype._shouldUpdate = function (prevDescriptor, nextDescriptor) {
    return prevDescriptor && nextDescriptor && (prevDescriptor.type === nextDescriptor.type);
};

module.exports = VTagComponent;