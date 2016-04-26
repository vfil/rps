'use strict';

var ElementAttributes = require('./ElementAttributes.js');
var utils = require('../utils.js');

/**
 * A virtual representation of DOM for rendering and updating DOM Elements.
 * @exports vdom/VDOM
 */

var VDOM = module.exports = {
    /**
     * Inserts/modify DOM representation of a {VComponent} in given DOM node container.
     * @param {VDescriptor} nextDescriptor - a component descriptor which will be attached to container.
     * @param {DOMElement} container - Element reference to which component should be rendered.
     */
    render: function (nextDescriptor, container) {

        var prevComponent = instancesByRootID[getRootID(container)];

        if (prevComponent) {
            //component is present - update it.
            updateRootComponent(prevComponent, nextDescriptor);
        } else {
            //component is provided first time - insert it.
            renderNewRootComponent(nextDescriptor, container);

            //listen on container events and call registered listeners
            attachGlobalListener(container);
        }
    },

    /**
     * Getter for registered event listener.
     * @param {string} uid - UID of component
     * @param {string} eType - should correspond to standard DOM Event.type.
     * @returns {Function|null}
     */
    getListener: function (uid, eType) {
        return (listeners[uid] && listeners[uid][eType]) || null;
    },

    /**
     * Add listeners to component events
     * @param {string} uid - UID of component
     * @param {string} eType - should correspond to standard DOM Event.type.
     * @param {Function} listener - event handler function.
     */
    addListener: function (uid, eType, listener) {
        if(typeof listener !== 'function') {
            throw new Error('listener argument must be a function!!!');
        }

        if (!listeners[uid]) {
            listeners[uid] = {};
        }
        //TODO do we need support of multiple handlers per event? By now works fine.
        listeners[uid][eType] = listener;
    },

    /**
     * Removes all event handlers for provided component uid.
     * @param {string} uid - UID of component
     */
    deleteAllListeners: function (uid) {
        EVENT_TYPES.forEach(function (eventType) {
            this.removeListener(uid, eventType);
        }.bind(this));
    },

    /**
     * Removes an event handler from global container.
     * @param {string} uid - UID of component
     * @param {string} eType - should correspond to standard DOM Event.type.
     */
    removeListener: function (uid, eType) {
        if (listeners[uid] && listeners[uid][eType])
            delete listeners[uid][eType];
    },

    /**
     * Enqueues markup to be inserted at index.
     * @param {string} parentID - UID of the parent component.
     * @param {string} markup - HTML that renders into an element.
     * @param {number} toIndex - at which position.
     */
    enqueueMarkup: function (parentID, markup, toIndex) {
        updateQueue.push({
            parentID: parentID,
            parentNode: null,
            type: UPDATE_TYPES.INSERT_MARKUP,
            markupIndex: markupQueue.push(markup) - 1,
            textContent: null,
            fromIndex: null,
            toIndex: toIndex
        });
    },

    /**
     * Enqueues removing an element at an index.
     * @param {string} parentID - UID of the parent component.
     * @param {number} fromIndex - at which position.
     */
    enqueueRemove: function (parentID, fromIndex) {
        updateQueue.push({
            parentID: parentID,
            parentNode: null,
            type: UPDATE_TYPES.REMOVE_NODE,
            markupIndex: null,
            textContent: null,
            fromIndex: fromIndex,
            toIndex: null
        });
    },

    /**
     * Enqueues setting the text content.
     * @param {string} parentID - UID of the parent component.
     * @param {string} textContent - Text content to set.
     */
    enqueueTextContent: function (parentID, textContent) {
        updateQueue.push({
            parentID: parentID,
            parentNode: null,
            type: UPDATE_TYPES.TEXT_CONTENT,
            markupIndex: null,
            textContent: textContent,
            fromIndex: null,
            toIndex: null
        });
    },

    /**
     * Processes any enqueued updates.
     */
    processQueue: function () {
        if (updateQueue.length) {
            processUpdates(updateQueue, markupQueue);
            clearQueue();
        }
    },

    /**
     * Set DOM Element Attribute
     * @param {string} uid - uid of component.
     * @param {string} name - attribute name.
     * @param {string} value - attribute value.
     */
    updateAttributeByID: function (uid, name, value) {
        var node = getNode(uid);
        node.setAttribute(ElementAttributes.attributeNames[name], '' + value)
    }
};

/**
 * ENUM of update types actions
 * @private
 * @readonly
 */
var UPDATE_TYPES = {
    INSERT_MARKUP: 'INSERT_MARKUP',
    REMOVE_NODE: 'REMOVE_NODE',
    TEXT_CONTENT: 'TEXT_CONTENT'
};

/**
 * List of events to which Components can subscribe.
 * @private
 * @type {string[]}
 * @readonly
 */
var EVENT_TYPES = [
    'click',
    'mousemove'
];

/**
 * Map of UID to root Components rendered on the page.
 * @private
 */
var instancesByRootID = {};

/**
 * Map form ID to container element.
 * @private
 * @type {{}}
 */
var containersByRootID = {};

/**
 * Queue of update configuration objects.
 * @type {Array}
 * @private
 */
var updateQueue = [];

/**
 * Queue of markup configuration objects.
 * @type {Array}
 * @private
 */
var markupQueue = [];

/**
 * Listeners global container.
 * A structure for keeping event handlers for each component.
 * Handler can be retrieved as listeners[UID][eventType]
 * @private
 */
var listeners = {};

/**
 * Clears any enqueued updates.
 * @private
 */
function clearQueue() {
    updateQueue.length = 0;
    markupQueue.length = 0;
}

/**
 * Computes a descriptor markup and render it into container.
 * @private
 * @param {VDescriptor} nextDescriptor - descriptor to be rendered.
 * @param {DOMElement} container - Element reference to which component should be rendered.
 */
function renderNewRootComponent(nextDescriptor, container) {
    var componentInstance = nextDescriptor.instantiateComponent();
    //register component in order to be able to detect updates.
    var UID = registerComponent(componentInstance, container);

    //insert markup for given component
    container.innerHTML = componentInstance.getMarkup(UID);
}

/**
 * Updates a component in DOM.
 * @private
 * @param {VComponent} prevComponent - component to update.
 * @param {VDescriptor} nextDescriptor - descriptor instance to render.
 */
function updateRootComponent(prevComponent, nextDescriptor) {
    //next props for component
    var nextProps = nextDescriptor.props;
    //component is the same, update representation with next props
    prevComponent.replaceProps(nextProps);
}

/**
 * Caches component and container with an associated ID.
 * @private
 * @param {VComponent} componentInstance
 * @param {DOMElement} container
 * @returns {string} UID - UID of root Component
 */
function registerComponent(componentInstance, container) {
    //TODO improve this later allowing to render multiple root components on the same page
    //Always start with 0 index for root Component
    var UID = ElementAttributes.ATTR_SEPARATOR + '0';
    containersByRootID[UID] = container;
    instancesByRootID[UID] = componentInstance;
    return UID;
}

/**
 * Returns ID of component based on special attribute markup given a DOM Element.
 * @private
 * @param {DOMElement} container
 * @returns {string} UID - UID of root Component
 */
function getRootID(container) {
    var rootElement = container.firstChild;
    return getID(rootElement);

}

/**
 * Returns a DOM Element attribute internally used as UID.
 * @private
 * @param node
 * @returns {*|string}
 */
function getID(node) {
    return node && node.getAttribute && node.getAttribute(ElementAttributes.UID_ATTR_NAME);
}


//TODO find a better way to collect ALL event types
/**
 * Adds listeners to to provided container.
 * These listeners are used to trigger registered listeners at bubbling phase.
 * @param container - root container DOM element
 * @private
 */
function attachGlobalListener(container) {
    EVENT_TYPES.forEach(function (eventType) {
        //add listener on the top on capture phase,
        //as focus, blur, etc. doesn't bubble.
        container.addEventListener(eventType, function (event) {
            var nodeUID = getID(event.target);
            var listener = VDOM.getListener(nodeUID, event.type);
            if (listener) {
                listener(event);
            }
        }, false);
    });
}

/**
 * Finds a node with the supplied UID inside of the supplied ancestorNode.
 * @param {string} uid ID of the DOM representation of the component.
 * @return {DOMElement} DOM node with the supplied `targetID`.
 * @private
 */
function getNode(uid) {
    var ancestorNode = containersByRootID['.0'];
    var firstChildren = [];
    var childIndex = 0;
    firstChildren[0] = ancestorNode.firstChild;

    while (childIndex < firstChildren.length) {
        var child = firstChildren[childIndex++];
        while (child) {
            var childID = getID(child);
            if (uid === childID) {
                return child;
            } else if (uid.indexOf(childID) === 0) {
                //optimizing by diving right into closer ancestor and skip other nodes.
                firstChildren.length = childIndex = 0;
                firstChildren.push(child.firstChild);
            }
            child = child.nextSibling;
        }
    }
}

/**
 * Updates DOM based on queued messages.
 *
 * @param {Array} updateList List of update configurations.
 * @param {Array.<string>} markupList List of markup strings.
 * @private
 */
function processUpdates(updateList, markupList) {
    //retrieve parentNode for each update message
    for (var m = 0; m < updateList.length; m++) {
        updateList[m].parentNode = getNode(updateList[m].parentID);
    }

    //process remove before new markup for consistency.
    var update;
    for (var i = updateList.length - 1; update = updateList[i]; i--) {
        if (update.type === UPDATE_TYPES.REMOVE_NODE) {
            var updatedIndex = update.fromIndex;
            var updatedChild = update.parentNode.childNodes[updatedIndex];
            updatedChild.parentNode.removeChild(updatedChild);
        }
    }

    var renderedMarkup = nodesFromHtml(markupList.join(''));
    for (var k = 0; update = updateList[k]; k++) {
        switch (update.type) {
            case UPDATE_TYPES.INSERT_MARKUP:
                var parentNode = update.parentNode;
                var childNode = renderedMarkup[update.markupIndex];
                var referenceNode = parentNode.childNodes[update.toIndex] || null;
                parentNode.insertBefore(childNode, referenceNode);
                break;
            case UPDATE_TYPES.TEXT_CONTENT:
                update.parentNode.textContent = update.textContent;
                break;
            case UPDATE_TYPES.REMOVE_NODE:
                // removed above.
                break;
        }
    }
}

/**
 * Creates an array containing the nodes rendered from the supplied html.
 * @private
 * @param {string} html A string of valid HTML markup.
 * @return {Array.<Node>} An array of rendered nodes.
 */
function nodesFromHtml(html) {
    var node = document.createElement('div');
    node.innerHTML = html;
    return Array.prototype.slice.call(node.childNodes);
}
