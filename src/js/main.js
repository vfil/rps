'use strict';

var reducer = require('./reducer.js');
var Store = require('./common/store.js');
var counterFunc = require('./domain/counter.js');
var renderFunc = require('./render.js');
var RPS = require('./rps.js');

(function() {
    var store = Store(reducer, {});
    RPS(store, renderFunc, counterFunc);
})();