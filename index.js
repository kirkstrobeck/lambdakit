'use strict';

require('strict-version');

console.log('=== LAMBDAKIT ===');

var $ = GLOBAL.$ = {};

$._ = require('lodash');
$.archiver = require('archiver');
$.argv = require('minimist')(process.argv.slice(2));
$.AWS = require('aws-sdk');
$.exec = require('child_process').exec;
$.filesize = require('filesize');
$.fs = require('fs-extra');
$.git = require('git-rev-sync');
$.mkdirp = require('mkdirp');
$.Promise = require('es6-promise').Promise;

$.root = __dirname + '/../..';

$.packageJson = require($.root + '/package.json');
try { require($.root + '/config.aws.lambdakit.js'); } catch (e) {}

$.AWS.config.region = $._.result($.packageJson, 'lambdakit.region', 'us-east-1');
$.pathToLambdas = $.root + $._.result($.packageJson, 'lambdakit[\'path-to-lambdas\']', '/lib/lambdas');
$.pathToShared = $.root + $._.result($.packageJson, 'lambdakit[\'path-to-shared\']', '/lib/shared');
$.prefixWithBranchName = $.root + $._.result($.packageJson, 'lambdakit[\'prefix_with_branch_name\']', true);

if (typeof $.argv['deploy'] === 'string') {
  $.lambdaDirs = [$.argv['deploy']];
} else {
  $.lambdaDirs = $.fs.readdirSync($.pathToLambdas) || null;
  if ($.lambdaDirs[0] === '.DS_Store') $.lambdaDirs.splice(0, 1);
}

$.exportDir = $.root + '/exports';

require('./lib/' + Object.keys($.argv)[1]);
