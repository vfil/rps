'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VRoundLog = require('./VRoundLog.js');

module.exports = VComponent.createClass({
    render: function() {

        var roundLogs = this.props.logs.map(function(roundLog) {
            return VRoundLog({log: roundLog});
        });

        return VTag.div(null, roundLogs);
    }
});