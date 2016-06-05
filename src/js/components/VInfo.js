'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');

module.exports = VComponent.createClass({
    render: function() {
        var message = VTag.div({className: 'heading1'}, this.props.message);
        var hint = VTag.div({className: 'info-hint'}, this.props.hint);
        return VTag.div({className: 'info text-center'}, [message, hint]);
    }
});
