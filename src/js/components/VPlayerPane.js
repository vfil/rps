'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VPlayer = require('./VPlayer.js');
var toClassname = require('../common/utils.js').toClassname;

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

        var className = toClassname('pane-player col-12 col-large-4', {
            mirror: this.props.mirror
        });
        return VTag.div({className: className}, playerViews);
    }
});
