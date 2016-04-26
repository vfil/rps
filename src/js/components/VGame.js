'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var PlayerPane = require('./VPlayerPane.js');
var VInfoPane = require('./VInfoPane.js');

module.exports = VComponent.createClass({
    render: function() {
        var leftPane = PlayerPane({
            counting: this.props.counting,
            players: this.props.leftPane,
            gestures: this.props.gestures,
            onGestureChange: this.props.changeGesture
        });
        var rightPane = PlayerPane({
            counting: this.props.counting,
            players: this.props.rightPane,
            gestures: this.props.gestures,
            mirror: true,
            onGestureChange: this.props.changeGesture
        });
        var infoPane = VInfoPane({info: this.props.info, logs: this.props.logs});

        return VTag.div({className: 'container'}, [leftPane, infoPane, rightPane]);
    }
});
