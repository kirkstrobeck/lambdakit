var $ = GLOBAL.$;
var currentLambda = setCurrentLambda(0);
var i = 0;

(function updateLambda () {
  console.log('fn:updateLambda', currentLambda.nameWithStage);
  return new Promise(function (resolve, reject) {
    npmInstall($.lambdaDirs[i])
      .then(copyShared)
      .then(createArchive)
      .then(uploadLambda)
      .then(function () {
        if (i < $.lambdaDirs.length - 1) {
          i++;
          currentLambda = setCurrentLambda(i);
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

function setCurrentLambda (i) {
  return {
    name: $.lambdaDirs[i],
    nameWithStage: $.prefixWithBranchName
      ? $.git.branch() + '-' + $.lambdaDirs[i]
      : $.lambdaDirs[i]
  };
}

function handleError (error) {
  console.log('fn:handleError');
  console.log('Error');
  console.log(error);
  process.exit(1);
}

function uploadLambda () {
  console.log('fn:uploadLambda', currentLambda.nameWithStage);
  return new Promise(function (resolve, reject) {
    var lambda = new $.AWS.Lambda({apiVersion: '2015-03-31'});
    var params = {
      FunctionName: currentLambda.nameWithStage,
      Publish: true,
      ZipFile: $.fs.readFileSync($.exportDir + '/' + currentLambda.name + '.zip')
    };
    lambda.updateFunctionCode(params, function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function copyShared () {
  console.log('fn:copyShared', currentLambda.nameWithStage);
  return new Promise(function (resolve, reject) {
    try {
      $.fs.copy($.pathToShared, $.pathToLambdas + '/' + currentLambda.name + '/shared', function (e) {
        resolve();
      });
    } catch (e) {
      resolve();
    }
  });
}

function npmInstall () {
  console.log('fn:npmInstall', currentLambda.nameWithStage);
  return new Promise(function (resolve, reject) {
    $.exec('cd ' + $.pathToLambdas + '/' + currentLambda.name + '; npm install',
      function (error, stdout, stderr) {
        if (error) reject(error);
        resolve(stderr);
        resolve(stdout);
      });
  });
}

function createArchive () {
  console.log('fn:createArchive', currentLambda.nameWithStage);
  return new Promise(function (resolve, reject) {
    $.mkdirp($.exportDir);
    var output = $.fs.createWriteStream($.exportDir + '/' + currentLambda.name + '.zip');
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
      cwd: $.pathToLambdas + '/' + currentLambda.name,
      src: ['**/*']
    }]);
    archive.finalize();
  });
}

