'use strict';

/* jshint strict:true, node:true */

var fs = require('fs');
var et = require('elementtree');

var data = fs.readFileSync(__dirname + '/config.xml').toString();
var etree = et.parse(data);
var root = etree.getroot();

if (root.tag === 'widget') {
  var version = root.get('version');
}

module.exports = version;
