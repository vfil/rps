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

            //check if such topic exists and add one
            if (!topics.hasOwnProperty(topic)) {
                topics[topic] = [];
            }

            //Add listener to queue
            var index = topics[topic].push(listener) - 1;

            //return subscriber function
            return (function () {
                var executed = false;
                return function () {
                    if (!executed) {
                        topics[topic].splice(index);
                    }
                }
            })();
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