'use strict';

const root = __dirname + '/../../..';
const argv = require('minimist')(process.argv.slice(2));
const packageJson = require(root + '/package.json');
const pathToLambdas = packageJson.lambdakit['path-to-lambdas'] || '/lib';
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
