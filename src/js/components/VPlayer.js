'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var VGestures = require('./VGestures.js');
var utils = require('../common/utils.js');

module.exports = VComponent.createClass({
    render: function() {
        return VTag.div({className: 'player text-center'},
            [
                VTag.span({className: 'heading1'}, this.props.player.name),
                VTag.span({className: 'wins heading1'}, this.props.player.gameWins),
                VGestures({
                    counting: this.props.counting,
                    player: this.props.player,
                    gestures: this.props.gestures,
                    onGestureChange: this.props.player.isHuman ? this.props.onGestureChange : utils.noop
                })
            ]
        );
    }
});
