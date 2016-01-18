console.log('==Lambdakit==');
const args = require('minimist')(process.argv.slice(2));
require('./lib/' + Object.keys(args)[1]);
