'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VPlayer = require('./VPlayer.js');

module.exports = VComponent.createClass({
    render: function() {

        var playerViews = this.props.players.map(function(player) {
            return VPlayer({
                counting: this.props.counting,
                player: player,
                gestures: this.props.gestures,
                onGestureChange: this.props.onGestureChange
            });
        }.bind(this));

        var className = 'pane' + (this.props.mirror ? ' mirror' : '');

        return VTag.div({className: className}, playerViews);
    }
});