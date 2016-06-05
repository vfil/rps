'use strict';

var expect = require('chai').expect;
var utils = require('../src/js/common/utils.js');

describe('utils specs:', function () {
    it('#generateDynamicProps should create a new object with applied function', function () {
        var conf = {
            blue: 'blue',
            red: 'red'
        };

        function tellColor(color) {
            return 'color ' + color;
        }

        var result = utils.generateDynamicProps(conf, tellColor);

        expect(result.blue).to.equal('color blue');
        expect(result.red).to.equal('color red');
    });

    it('#escapeTextForBrowser replaces dangerous characters html entities', function () {
        var str = 'amp&,gt>,lt<,quot\",\'';
        expect(utils.escapeTextForBrowser(str)).to.equal('amp&amp;,gt&gt;,lt&lt;,quot&quot;,&#x27;');
    });

    it('#toClassname should join two string separated by space', function () {
        expect(utils.toClassname('one', 'two')).to.equal('one two');
    });

    it('#toClassname should create class attribute string given two objects', function () {
        expect(utils.toClassname({one: true}, {two: true})).to.equal('one two');
    });

    it('#toClassname should create class attribute string given one string and one object', function () {
        expect(utils.toClassname('one', {two: true})).to.equal('one two');
    });

    it('#toClassname should not add class if empty string provided', function () {
        expect(utils.toClassname('', {two: true})).to.equal('two');
    });

    it('#toClassname should not add class if object value evaluates to false', function () {
        expect(utils.toClassname('one', {two: false})).to.equal('one');
    });
});
