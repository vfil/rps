'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VGestures = require('./VGestures.js');

module.exports = VComponent.createClass({
    render: function() {
        return VTag.div(null,
            [
                VTag.div(null, this.props.player.name),
                VGestures({
                    counting: this.props.counting,
                    player: this.props.player,
                    gestures: this.props.gestures,
                    onGestureChange: this.props.player.isHuman ? this.props.onGestureChange : function() {}
                })
            ]
        );
    }
});