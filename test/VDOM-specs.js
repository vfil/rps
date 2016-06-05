'use strict';

var expect = require('chai').expect;

var VDOM = require('../src/js/common/vdom/VDOM.js');
var VTag = require('../src/js/common/vdom/VTag.js');
var VComponent = require('../src/js/common/vdom/VComponent.js');

describe('VDOM specs - one nested level:', function () {

    var container,
        ComponentClass,
        eventClickCount = 0,
        eventMouseMoveCount = 0,
        props,
        newProps;

    beforeEach(function () {
        container = document.createElement('div');
        container.className = 'app';
        document.body.appendChild(container);

        props = {
            foo: 'bar',
            friends: ['bob', 'alice'],
            className: 'active',
            onClick: function () {
                eventClickCount++;
            },
            onMouseMove: function () {
                eventMouseMoveCount++;
            },
            onFriendClick: function () {

            }
        };

        newProps = {
            foo: 'bar',
            className: 'disabled',
            friends: ['alice', 'bob'],
            onClick: function () {
                eventClickCount--;
            },
            onMouseMove: function () {
                eventMouseMoveCount++;
            },
            onFriendClick: function () {

            }
        };

        var render = function () {
            var friends = this.props.friends.map(function (friend) {
                return VTag.div({onClick: this.props.onFriendClick}, friend);
            }.bind(this));
            return VTag.div(this.props, friends);
        };

        ComponentClass = VComponent.createClass({render: render});
    });

    afterEach(function () {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        eventClickCount = 0;
    });

    it('should render root component in DOM', function () {
        VDOM.render(ComponentClass(props), container);
        var expectedHtml = '<div class="active" data-uid=".0"><div data-uid=".0.0">bob</div><div data-uid=".0.1">alice</div></div>';
        expect(container.innerHTML).to.equal(expectedHtml);
    });

    it('should update dom when calling render with different props', function () {
        VDOM.render(ComponentClass(props), container);
        props.friends[1] = 'Fred';
        var expectedHtml = '<div class="active" data-uid=".0"><div data-uid=".0.0">bob</div><div data-uid=".0.1">Fred</div></div>';
        VDOM.render(ComponentClass(props), container);
        expect(container.innerHTML).to.equal(expectedHtml);
    });

    it('#getListener should return event handler', function () {
        var listener = new Function();
        VDOM.addListener('uid', 'click', listener);
        expect(VDOM.getListener('uid', 'click')).to.equal(listener);
    });

    it('#addListener should throw an exception if listener is not a Function type', function () {
        var wrapperFn = function () {
            VDOM.addListener('uid', 'click', {});
        };
        expect(wrapperFn).to.throw(Error);
    });

    it('#removeListener should remove a registered listener', function () {
        VDOM.addListener('uid', 'click', function () {});
        VDOM.removeListener('uid', 'click');
        expect(VDOM.getListener('uid', 'click')).to.be.null;
    });

    it('#deleteAllListeners should remove all registered listeners for component', function () {
        VDOM.addListener('uid', 'click', function () {});
        VDOM.addListener('uid', 'mousemove', function () {});
        VDOM.deleteAllListeners('uid');
        expect(VDOM.getListener('uid', 'click')).to.be.null;
        expect(VDOM.getListener('uid', 'mousemove')).to.be.null;
    });

    it('should handle click events', function () {
        VDOM.render(ComponentClass(props), container);
        var rootComponent = container.firstChild;
        rootComponent.click();
        expect(eventClickCount).to.equal(1);
    });

    it('should handle multiple events', function () {
        VDOM.render(ComponentClass(props), container);
        var rootComponent = container.firstChild;
        rootComponent.click();
        var event = document.createEvent('MouseEvent');
        event.initEvent('mousemove', true, true);
        rootComponent.dispatchEvent(event);
        expect(
          eventClickCount,
          'click handler called'
        ).to.equal(1);
        expect(
          eventMouseMoveCount,
          'mousemove handler called'
        ).to.equal(1);
    });

    it('should update event listeners', function () {
        VDOM.render(ComponentClass(props), container);
        var rootComponent = container.firstChild;
        rootComponent.click();
        expect(eventClickCount).to.equal(1);
        VDOM.render(ComponentClass(newProps), container);
        rootComponent = container.firstChild;
        rootComponent.click();
        expect(eventClickCount).to.equal(0);
    });

    it('should update component attributes and reorder children components', function () {
        VDOM.render(ComponentClass(props), container);
        VDOM.render(ComponentClass(newProps), container);
        var expectedHtml = '<div class="disabled" data-uid=".0"><div data-uid=".0.0">alice</div><div data-uid=".0.1">bob</div></div>';
        expect(container.innerHTML).to.equal(expectedHtml);
    });

    it('should react only on own events', function () {
        VDOM.render(ComponentClass(props), container);
        var rootComponent = container.firstChild;
        var firstFriend = rootComponent.firstChild;
        firstFriend.click();
        expect(
          eventClickCount,
          'does not affect other components events'
        ).to.equal(0);

        container.click();
        expect(
          eventClickCount,
          'does not affect other Elements events'
        ).to.equal(0);
    });

    it('should remove nodes and listeners', function () {
        VDOM.render(ComponentClass(props), container);
        props.friends.splice(0, 1);
        var expectedHtml = '<div class="active" data-uid=".0"><div data-uid=".0.0">alice</div></div>';
        VDOM.render(ComponentClass(props), container);
        expect(container.innerHTML).to.equal(expectedHtml);
    });

    it('should add new nodes and listeners to it', function () {
        VDOM.render(ComponentClass(props), container);
        props.friends.push('Max');
        var expectedHtml = '<div class="active" data-uid=".0"><div data-uid=".0.0">bob</div><div data-uid=".0.1">alice</div><div data-uid=".0.2">Max</div></div>';
        VDOM.render(ComponentClass(props), container);
        expect(container.innerHTML).to.equal(expectedHtml);
    });
});

describe('VDOM specs - two nested level:', function () {

    var container,
        ComponentClass,
        props,
        newProps;

    beforeEach(function () {
        container = document.createElement('div');
        container.className = 'app';
        document.body.appendChild(container);

        props = {
            groups: [
                ['bob', 'alice'],
                ['ted', 'ned']
            ]
        };

        newProps = {
            groups: [
                ['bob', 'alice']
            ]
        };


        var GroupClass = VComponent.createClass({
            render: function () {
                var friends = this.props.friends.map(function (friend) {
                    return VTag.div(null, friend);
                });
                return VTag.div(this.props, friends);
            }
        });

        var render = function () {
            var groups = this.props.groups.map(function (friends) {
                return GroupClass({friends: friends});
            }.bind(this));
            return VTag.div(this.props, groups);
        };

        ComponentClass = VComponent.createClass({render: render});
    });

    afterEach(function () {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        props = null;
        newProps = null;
    });

    it('should render root component in DOM', function () {
        VDOM.render(ComponentClass(props), container);
        var expectedHtml = '<div data-uid=".0"><div data-uid=".0.0"><div data-uid=".0.0.0">bob</div><div data-uid=".0.0.1">alice</div></div><div data-uid=".0.1"><div data-uid=".0.1.0">ted</div><div data-uid=".0.1.1">ned</div></div></div>';
        expect(container.innerHTML).to.equal(expectedHtml);
    });

    it('should remove composed component', function () {
        VDOM.render(ComponentClass(props), container);
        VDOM.render(ComponentClass(newProps), container);
        var expectedHtml = '<div data-uid=".0"><div data-uid=".0.0"><div data-uid=".0.0.0">bob</div><div data-uid=".0.0.1">alice</div></div></div>';
        expect(container.innerHTML).to.equal(expectedHtml);
    });

    it('should move children inside composed component', function () {
        VDOM.render(ComponentClass(props), container);
        newProps.groups.unshift(['ted', 'ned']);
        VDOM.render(ComponentClass(newProps), container);
        var expectedHtml = '<div data-uid=".0"><div data-uid=".0.0"><div data-uid=".0.0.0">ted</div><div data-uid=".0.0.1">ned</div></div><div data-uid=".0.1"><div data-uid=".0.1.0">bob</div><div data-uid=".0.1.1">alice</div></div></div>';
        expect(container.innerHTML).to.equal(expectedHtml);
    });

});
