console.log('==Lambdakit==');
require('./lib/' + Object.keys(require('minimist')(process.argv.slice(2)))[1]);
