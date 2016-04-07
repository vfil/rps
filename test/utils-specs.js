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
        var str = "amp&,gt>,lt<,quot\",\'";
        expect(utils.escapeTextForBrowser(str)).to.equal('amp&amp;,gt&gt;,lt&lt;,quot&quot;,&#x27;');
    });
});