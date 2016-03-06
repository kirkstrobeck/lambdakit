var $ = GLOBAL.$;

if ($.argv.hasOwnProperty('run')) {
  var pathToLambda = $.pathToLambdas + '/' + $.argv.run;
  try { $.fs.copySync($.pathToShared, pathToLambda + '/shared'); } catch (e) {}
  require(pathToLambda).handler(
    require(pathToLambda + '/event'),
    { succeed: report, fail: report }
  );
}

function report (data) {
  console.log(data);
  process.exit(0);
}
