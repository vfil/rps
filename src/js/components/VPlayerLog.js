'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');

module.exports = VComponent.createClass({
    render: function() {
        //TODO write utils to work with class attributes
        var directionClass = this.props.index % 2 ? ' log-left' : '';
        var isWinnerClass = this.props.isWinner ? ' winner' : '';
        var className = this.props.gesture + '-log' + ' log-icon' + isWinnerClass + directionClass;
        return VTag.span({className: className}, '');
    }
});