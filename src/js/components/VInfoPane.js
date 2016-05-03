'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VRoundLogs = require('./VRoundLogs.js');
var VInfo = require('./VInfo.js');

module.exports = VComponent.createClass({
    render: function() {
        var logs = VRoundLogs({logs: this.props.logs});
        var info = VInfo({info: this.props.info});
        return VTag.div({className: 'col-12 col-land-4 col-large-4'}, [info, logs]);
    }
});
