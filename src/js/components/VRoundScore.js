'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');

module.exports = VComponent.createClass({
    render: function() {
        var separator = VTag.span({className: 'heading1'}, ':');
        var leftScore = VTag.span({className: 'heading1 player-score'}, this.props.leftScore);
        var rightScore = VTag.span({className: 'heading1 player-score'}, this.props.rightScore);
        return VTag.div({className: 'score'}, [leftScore, separator, rightScore]);
    }
});
