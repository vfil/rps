'use strict';

var utils = {};
/**
 * Generates an object resulted from applying provided function to each field of provided object.
 * @param {object} obj - a object whose key will be copied.
 * @param {function} func - a function which result will be set as value for obj keys.
 * @returns {{}}
 */
utils.generateDynamicProps = function (obj, func) {
    var ret = {};
    for (var key in obj) {
        /* istanbul ignore else */
        if (obj.hasOwnProperty(key)) {
            ret[key] = func.call(null, key, obj[key]);
        }
    }
    return ret;
};

var ESCAPE_LOOKUP = {
    "&": "&amp;",
    ">": "&gt;",
    "<": "&lt;",
    "\"": "&quot;",
    "'": "&#x27;"
};

var ESCAPE_REGEX = /[&><"']/g;

function escaper(match) {
    return ESCAPE_LOOKUP[match];
}

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {string} text - Text value to escape.
 * @return {string} - An escaped string.
 */
utils.escapeTextForBrowser = function(text) {
    return ('' + text).replace(ESCAPE_REGEX, escaper);
};

module.exports = utils;