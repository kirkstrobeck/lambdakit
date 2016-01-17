var weather = require('weather-js');

exports.handler = function (event, context) {
  weather.find(event, function (err, result) {
    if (err) context.fail(err);
    context.succeed(JSON.stringify(result, null, 2));
  });
};
