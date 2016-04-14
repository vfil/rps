'use strict';

/**
 * Application state storage factory function. Call this function with a reducer function and initial state
 * of application. Reducer function is responsible for changing state when an action is dispatched.
 * Initial state is a plain object that represents application state.
 * Function returns a storage instance which is able to get current application state,
 * dispatch actions which encapsulates information needed to change state and to
 * subscribe to state change events.
 * @module Store
 * @param {Function} reducer - function to calculate next state.
 * @param {Object} initialState - initial representation of state.
 */
module.exports = function (reducer, initialState) {

    /**
     * Boolean flag to check whether reducer recursively dispatches actions.
     * @private
     * @type {boolean}
     */
    var isDirty = false;

    /**
     * Current representation of state.
     * @private
     * @type {Object}
     */
    var currentState = initialState;

    /**
     * Listeners container.
     * @private
     * @type {Array}
     */
    var listeners = [];

    return {
        /**
         * Returns current state.
         * @instance
         * @returns {object} - current state representation.
         */
        getState: function () {
            return currentState
        },

        /**
         * Dispatches an action so that state is changed according to provided reducer function.
         * State is computed calling reducer function with currentState and action as arguments.
         * After state change will call all subscribers to let them know that state changed.
         * Further subscriber can call getState to retrieve state.
         * Dispatch will throw an error if reducer is recursively dispatching actions,
         * the same effect can be achieved registering a listener which will trigger an action.
         * @instance
         * @param {object} action - Object which represent a payload and intention to change state.
         * Action must have 'type' field a string that identifies type of action.
         */
        dispatch: function (action) {

            //check for recursive dispatching in reducer function
            if (isDirty) {
                throw new Error('A current state change should not modify it recursively!!!');
            }

            try {
                isDirty = true;
                currentState = reducer(currentState, action);
            } finally {
                isDirty = false;
            }

            for (var i = 0; i < listeners.length; i++) {
                listeners[i]()
            }
        },

        /**
         * Registers a listener which will be called each time state changes.
         * Returns a function - when called unsubscribes listener.
         * @instance
         * @param {function} listener - listener to be registered.
         * @returns {Function}
         */
        subscribe: function (listener) {

            //validate listener
            if (typeof listener !== 'function') {
                throw new Error('Expected listener to be a function.');
            }

            //Add listener to queue
            listeners.push(listener);

            //flag to indicate whether listener was unregistered
            var isSubscribed = true;

            //return unsubscribe function
            return function () {
                if (isSubscribed) {
                    isSubscribed = false;
                    var index = listeners.indexOf(listener);
                    listeners.splice(index, 1);
                }
            };
        }
    }
};