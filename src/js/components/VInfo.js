'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');

module.exports = VComponent.createClass({
    render: function() {
        var message = VTag.div({className: 'heading1'}, this.props.info.message);
        var hint = VTag.div({className: 'info-hint'}, this.props.info.hint);
        return VTag.div({className: 'text-center'}, [message, hint]);
    }
});
