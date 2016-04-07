'use strict';

var Vtag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');

module.exports = VComponent.createClass({

    onClick: function() {
        this.props.onGestureChange(this.props.player, this.props.gesture);
    },
    render: function() {
        var cssClasses = this.props.active ? this.props.gesture + ' punch active' : this.props.gesture + ' punch';
        return Vtag.button({className: cssClasses, onClick: this.onClick.bind(this)}, '');
    }
});