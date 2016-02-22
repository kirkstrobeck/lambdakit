var $ = GLOBAL.$;

if ($.argv.hasOwnProperty('run')) {
  try {
    $.fs.copySync($.pathToShared, $.pathToLambda + '/shared');
  } catch (e) { console.log(e); }
  require($.pathToLambda).handler(
    require($.pathToLambda + '/event'),
    { succeed: report, fail: report }
  );
}

function report (data) {
  console.log(data);
  process.exit(0);
}
