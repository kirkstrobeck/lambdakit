'use strict';

const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2));

const root = __dirname + '/../../..';
const packageJson = require(root + '/package.json');
const pathToLambdas = _.result(packageJson, 'lambdakit[\'path-to-lambdas\']', '/lib');
const lambdaDir = root + pathToLambdas + '/' + argv.run;

if (argv.hasOwnProperty('run')) {
  require(lambdaDir).handler(
    require(lambdaDir + '/event'),
    { succeed: report, fail: report }
  );
}

function report (data) {
  console.log(data);
  process.exit(0);
}
