'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VPlayerLog = require('./VPlayerLog.js');

module.exports = VComponent.createClass({
    render: function() {
        var logs = this.props.log;
        var playerLogs = logs.map(function(playersLog, index) {
            playersLog.index = index;
            return VPlayerLog(playersLog);
        });

        var arrow;
        if(logs[0].isWinner) {
            arrow = 'icon-arrow-right';
        } else if(logs[1].isWinner) {
            arrow = 'icon-arrow-left';
        } else {
            arrow = 'icon-equals';
        }

        playerLogs.splice(1, 0, VTag.span({className: arrow}, ''));
        var className = 'log index' + this.props.index;
        return VTag.div({className: className}, playerLogs);
    }
});
