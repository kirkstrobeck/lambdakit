var $ = GLOBAL.$;
var currentLambda = $.lambdaDirs[0];
var i = 0;

(function updateLambda () {
  console.log('fn:updateLambda', currentLambda);
  return new Promise(function (resolve, reject) {
    npmInstall($.lambdaDirs[i])
      .then(createArchive)
      .then(uploadLambda)
      .then(function () {
        if (i < $.lambdaDirs.length - 1) {
          i++;
          currentLambda = $.lambdaDirs[i];
          updateLambda();
        } else {
          resolve();
        }
      })
      .catch(reject);
  });
})(0)
  .then(function () {
    process.exit();
  })
  .catch(handleError);

// --

function handleError (error) {
  console.log('fn:handleError');
  console.log('Error');
  console.log(error);
  process.exit(1);
}

function uploadLambda () {
  console.log('fn:uploadLambda', currentLambda);
  return new Promise(function (resolve, reject) {
    var lambda = new $.AWS.Lambda({apiVersion: '2015-03-31'});
    var params = {
      FunctionName: currentLambda,
      Publish: true,
      ZipFile: $.fs.readFileSync($.exportDir + '/' + currentLambda + '.zip')
    };
    lambda.updateFunctionCode(params, function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function npmInstall () {
  console.log('fn:npmInstall', currentLambda);
  return new Promise(function (resolve, reject) {
    $.exec('cd ' + $.pathToLambdas + '/' + currentLambda + '; npm install',
      function (error, stdout, stderr) {
        if (error) reject(error);
        resolve(stderr);
        resolve(stdout);
      });
  });
}

function createArchive () {
  console.log('fn:createArchive', currentLambda);
  return new Promise(function (resolve, reject) {
    $.mkdirp($.exportDir);
    var output = $.fs.createWriteStream($.exportDir + '/' + currentLambda + '.zip');
    var archive = $.archiver('zip');
    output.on('close', function () {
      resolve($.filesize(archive.pointer()));
    });
    archive.on('error', function (err) {
      throw err;
    });
    archive.pipe(output);
    archive.bulk([{
      expand: true,
      cwd: $.pathToLambdas + '/' + currentLambda,
      src: ['**/*']
    }]);
    archive.finalize();
  });
}

