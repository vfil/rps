'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var toClassname = require('../common/utils.js').toClassname;

module.exports = VComponent.createClass({
    render: function() {
        var iconClass = this.props.gesture + '-log';
        var className = toClassname('log-icon', iconClass, {
            winner: this.props.isWinner,
            'log-left': this.props.index % 2
        });
        return VTag.span({className: className}, '');
    }
});
