'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VPlayerLog = require('./VPlayerLog.js');

module.exports = VComponent.createClass({
    render: function() {

        var playerLogs = this.props.log.map(function(playersLog, index) {
            playersLog.index = index;
            return VPlayerLog(playersLog);
        });
        var className = 'log index' + this.props.index;
        return VTag.div({className: className}, playerLogs);
    }
});
