'use strict';

/**
 * Generic Publisher/Subscriber
 * @module common/eventEmitter
 */
module.exports = function () {

    /**
     * Map to hold topics and related listeners.
     * @private
     * @type {object}
     */
    var topics = {};

    return {
        /**
         * Registers a listener to specific topic
         * @param {string} topic - uid of topic
         * @param {function} listener - function to be executed when topic event triggered
         * @returns {function} - a function for unsubscribing listener
         */
        on: function (topic, listener) {

            //validate listener
            if (typeof listener !== 'function') {
                throw new Error('Expected listener to be a function.')
            }

            //check if such topic exists and add one
            if (!topics.hasOwnProperty(topic)) {
                topics[topic] = [];
            }

            //Add listener to queue
            topics[topic].push(listener);

            //flag to indicate state of current listener
            //and to prevent removing other listeners by calling unsubscribe multiple times
            var isSubscribed = true;

            //return unsubscribe function
            return function () {

                if (isSubscribed) {
                    isSubscribed = false;
                    var index = topics[topic].indexOf(listener);
                    topics[topic].splice(index, 1);
                }
            };
        },

        /**
         * Emit event on specific topic with specified message
         * @param {string} topic - uid of topic
         * @param {object} message - message to be passed as param to all registered listeners
         */
        emit: function (topic, message) {
            if (topics[topic]) {
                topics[topic].forEach(function (listener) {
                    listener(message);
                });
            }
        }
    }
};