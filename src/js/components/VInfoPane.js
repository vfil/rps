'use strict';

var VTag = require('../common/vdom/VTag.js');
var VComponent = require('../common/vdom/VComponent.js');

module.exports = VComponent.createClass({
    render: function() {
        return VTag.div({className: 'pane'}, this.props.info);
    }
});