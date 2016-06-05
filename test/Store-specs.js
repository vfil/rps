'use strict';

var expect = require('chai').expect;
var Store = require('../src/js/common/store.js');

describe('Store specs:', function () {
    var store,
        initialState;

    beforeEach(function() {
        initialState = {
            count: 0
        };
        var reducer = function (state, action) {
            if(action.type === 'INCREMENT') {
                state.count++;
            } else if(action.type === 'RECURSIVE_ACTION') {
                store.dispatch({
                    type: 'INCREMENT'
                });
            }

            return state;
        };

        store = Store(reducer, initialState);
    });

    it('#getState should return current state', function () {
        expect(store.getState()).to.equal(initialState);
    });

    it('#dispatch should dispatch action and reflect state change', function () {
        store.dispatch({
            type: 'INCREMENT'
        });
        expect(store.getState().count).to.equal(1);
    });

    it('#dispatch should throw an exception if reducer is making recursive calls', function () {
        function wrapperFn() {
            store.dispatch({
                type: 'RECURSIVE_ACTION'
            });
        }
        expect(wrapperFn).to.throw(Error);
    });

    it('#dispatch should call subscribers on state change and #subscribe should register subscribers', function () {
        var localCount = 0;
        function listener() {
            localCount = store.getState().count;
        }
        store.subscribe(listener);
        store.dispatch({
            type: 'INCREMENT'
        });
        expect(localCount).to.equal(1);
    });

    it('#subscribe should throw an error if provided listener is not a function', function () {
        function wrapperFn() {
            store.subscribe();
        }

        expect(wrapperFn).to.throw(Error);
    });

    it('#subscribe should return a unsubscribe function', function () {
        var localCount = 0;
        function listener() {
            localCount = store.getState().count;
        }
        var unsubscribe = store.subscribe(listener);
        store.dispatch({
            type: 'INCREMENT'
        });

        unsubscribe();
        store.dispatch({
            type: 'INCREMENT'
        });
        expect(localCount,
            'listener was not called'
        ).to.equal(1);
        expect(
          store.getState().count,
          'state changed'
        ).to.equal(2);
    });

    it('#subscribe unsubscribe function removes listeners properly', function () {
        var localCount1 = 0;
        function listener1() {
            localCount1 = store.getState().count;
        }
        var unsubscribe1 = store.subscribe(listener1);
        var localCount2 = 0;
        function listener2() {
            localCount2 = store.getState().count;
        }
        store.subscribe(listener2);
        store.dispatch({
            type: 'INCREMENT'
        });

        unsubscribe1();
        store.dispatch({
            type: 'INCREMENT'
        });
        expect(localCount1,
          'removedlistener was not called'
        ).to.equal(1);
        expect(localCount2,
          'otherListener was called'
        ).to.equal(2);
        unsubscribe1();
        store.dispatch({
            type: 'INCREMENT'
        });
        expect(localCount1,
          'twice removed listener was not called'
        ).to.equal(1);
        expect(localCount2,
          'otherListener was called after after second unsubscribe call'
        ).to.equal(3);
    });
});
