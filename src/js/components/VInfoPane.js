'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VRoundScore = require('./VRoundScore.js');
var VRoundLogs = require('./VRoundLogs.js');
var VInfo = require('./VInfo.js');

module.exports = VComponent.createClass({
    render: function() {
        var roundScore = VRoundScore({leftScore: this.props.leftScore, rightScore: this.props.rightScore});
        var logs = VRoundLogs({logs: this.props.logs});
        var info = VInfo({message: this.props.info.message, hint: this.props.info.hint});
        var inner  = VTag.div({className: 'pane-info-inner text-center'}, [info, roundScore, logs]);
        return VTag.div({className: 'pane-info col-12 col-large-4'}, [inner]);
    }
});
