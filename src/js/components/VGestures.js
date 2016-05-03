'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VGesture = require('./VGesture.js');

module.exports = VComponent.createClass({
    render: function() {

        var gesturesView = this.props.gestures.map(function(gesture) {
            var active = (this.props.player.isHuman || !this.props.counting) && gesture === this.props.player.gesture;
            return VGesture({
                active: active,
                playerName: this.props.player.name,
                gesture: gesture,
                human: this.props.player.isHuman,
                onGestureChange: this.props.onGestureChange
            });
        }.bind(this));
        return VTag.div({className: 'row punches'}, gesturesView);
    }
});
