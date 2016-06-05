'use strict';

var Vtag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');
var toClassname = require('../common/utils.js').toClassname;

module.exports = VComponent.createClass({

    onClick: function () {
        this.props.onGestureChange(this.props.playerName, this.props.gesture);
    },
    render: function () {
        var className = toClassname('punch', this.props.gesture, {
            human: this.props.human,
            active:this.props.active
        });
        var button = Vtag.button({
            className: className,
            onClick: this.onClick.bind(this)
        }, '');

        return Vtag.div({className: 'col-4 col-large-12 text-center'}, [button]);
    }
});
