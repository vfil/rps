'use strict';

var VDOM = require('./VDOM.js');
var VDescriptor = require('./VDescriptor.js');

/**
 * A generic Composable Virtual DOM element
 * @class
 */
var VComponent = function () {};

/**
 * A function that returns a factory for creating the VDescriptor for future VComponent instance.
 * Calling returned function with object parameter that represents the properties of VComponent
 * will return a descriptor for VComponent, which can be later rendered, updated, deleted from DOM.
 * See VDescriptor for more information. This object is later referred as props.
 * @param {Object} spec - object whose properties will be augmented with VComponent properties.
 * This parameter must have a 'render' property which is a function that returns a VDescriptor.
 * Usually VComponent is composed of another VComponent or VTagComponent which can have a finite nested children.
 * @example
 * var myCustomComponentClass = VComponent.createClass({
 *  render: function () {
 *      return VTag.div(
 *          {
 *              className: this.props.color
 *          },
 *          [VTag.button({onClick: this.props.onToggle}, this.props.buttonText)]
 *      );
 *  }
 * });
 *
 * Later:
 * //create a custom descriptor
 * var props = {
 *      color: 'green',
 *      buttonText: 'Disable item',
 *      onToggle: function(event) {
 *          console.log('button clicked.');
 *      }
 * }
 * var myDescriptor = myCustomComponentClass(props);
 * //render it in a node on the page with 'myApp' id.
 * VDOM.render(myDescriptor, document.getElementById('myApp'));
 * //update it
 * var newProps = {
 *      color: 'red',
 *      buttonText: 'Enable item',
 *      onToggle: function(event) {
 *          console.log('button clicked.');
 *      }
 * }
 * myDescriptor = myCustomComponentClass(newProps);
 * VDOM.render(myDescriptor, document.getElementById('myApp'));
 */
//TODO is it ok to put fields on functions???
VComponent.createClass = function (spec) {
    /**
     * Mixin of VComponent and provided spec object
     * Note. spec must have a'render' method.
     * @param {Object} props - an object that describes properties of current VComponent.
     * @constructor
     * @mixin
     */
    var ComponentMixin = function (props) {
        this.construct(props);
    };
    ComponentMixin.prototype = new VComponent();
    ComponentMixin.prototype.constructor = ComponentMixin;

    //TODO maybe it worth checking if spec overrides some important properties.
    //copy spec into ComponentMixin
    var proto = ComponentMixin.prototype;
    for (var name in spec) {
        /* istanbul ignore else */
        if (spec.hasOwnProperty(name)) {
            proto[name] = spec[name];
        }
    }

    //spec must provide render function
    if (typeof ComponentMixin.prototype.render !== 'function') {
        throw new Error('Class must implement a `render` method.');
    }

    //return a descriptor factory,
    //in fact a function that translates provided props to rendered html markup
    //according to provided render function.
    return VDescriptor.createFactory(ComponentMixin);
};

/**
 * Initialize a component from provided descriptor
 * @param {VDescriptor} descriptor
 */
VComponent.prototype.construct = function (descriptor) {
    this.props = descriptor.props;

    //Later used for component updates
    this._descriptor = descriptor;
};

/**
 * returns html markup for component.
 * @param {string} rootID - UID used in markup as attribute
 * @returns {string}
 */
VComponent.prototype.getMarkup = function (rootID) {
    return this.computeMarkup(rootID, 0);
};

/**
 * Recursively computes markup for this component and descendants.
 * @param {string} uid - UID used in markup as attribute.
 * @param {number} depth - ancestor's deep level.
 * @returns {string}
 */
VComponent.prototype.computeMarkup = function (uid, depth) {

    this._uid = uid;
    this._depth = depth;

    //instantiates descriptor of children component
    var childDescriptor = this._render();
    this._renderedComponent = childDescriptor.instantiateComponent();

    return this._renderedComponent.computeMarkup(uid, depth + 1);
};

/**
 * Updates component with new props object.
 *
 * @param {object} props - new props.
 */
VComponent.prototype.replaceProps = function (props) {
    var nextDescriptor = VDescriptor.cloneAndReplaceProps(this._descriptor, props);
    this.performUpdate(nextDescriptor);
};

/**
 * Recursively updates components
 * @param {VDescriptor} nextDescriptor - component descriptor from new props.
 */
VComponent.prototype.performUpdate = function (nextDescriptor) {
    var prevDescriptor = this._descriptor;
    this._descriptor = nextDescriptor;
    this.props = nextDescriptor.props;
    this.updateComponent(prevDescriptor);
};

/**
 * Updates Children components.
 * @param {VDescriptor} prevDescriptor - previous instance of component descriptor.
 */
VComponent.prototype.updateComponent = function (prevDescriptor) {
    var prevComponentInstance = this._renderedComponent;
    var nextDescriptor = this._render();
    prevComponentInstance.performUpdate(nextDescriptor);
};

/**
 * Removes component with descendants.
 */
VComponent.prototype.removeComponent = function () {
    this._renderedComponent.removeComponent();
    this._renderedComponent = null;
};

/**
 * Returns a VDescriptor as result of calling render function provided at class creation.
 * @returns {VDescriptor}
 * @private
 */
VComponent.prototype._render = function () {
    return this.render();
};

module.exports = VComponent;