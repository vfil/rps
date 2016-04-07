'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');

module.exports = VComponent.createClass({
    render: function() {
        var className = this.props.isWinner ? 'green' : !this.props.isTie ? 'red' : '';
        var text = this.props.name + ' ' + this.props.gesture;
        return VTag.div({className: className}, text);
    }
});