'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VGesture = require('./VGesture.js');

module.exports = VComponent.createClass({
    render: function() {

        var gesturesView = this.props.gestures.map(function(gesture) {
            var active = gesture === this.props.player.getGesture();
            return VGesture({
                active: active,
                player: this.props.player,
                gesture: gesture,
                onGestureChange: this.props.onGestureChange
            });
        }.bind(this));
        return VTag.div(null, gesturesView);
    }
});