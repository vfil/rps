'use strict';

var VGame = require('./components/VGame.js');
var VDOM = require('./common/vdom/VDOM.js');

module.exports = function (mapStateToProps) {
    /**
     * Flag to indicate whether document level events are handled.
     * @private
     * @type {boolean}
     */
    var eventsHandlersAttached = false;

    /**
     * Turns state into DOM view representation.
     * @module render
     * @param {object} state - current application state.
     * @param {object} handlers - key value map of handles for user events.
     */
    return function (state, handlers) {
        //attach needed high level events
        if (!eventsHandlersAttached) {
            eventsHandlersAttached = true;
            bindHighLevelEvents(handlers);
        }
        var props = mapStateToProps(state);
        //copy handlers to view props
        for (var key in handlers) {
            if (handlers.hasOwnProperty(key)) {
                if (!props[key]) {
                    props[key] = handlers[key];
                } else {
                    throw new Error('Trying to override existing property in props view object');
                }
            }
        }
        //instantiate main view component
        var gameComponent = VGame(props);
        //insert/update DOM based on provided props.
        VDOM.render(gameComponent, document.getElementById('app'));
    };
};
function bindHighLevelEvents(handlers) {
    //shortcut keys
    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.preventDefault();
            handlers.chooseRandomGesture();
        }
    });
}
