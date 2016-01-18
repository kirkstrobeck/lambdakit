# Lambda kit

![](http://i.giphy.com/X35necnRanNG8.gif)

**A strategy for working with lambdas.**

- Run Lambdas locally
- Deploy all Lambdas locally
- Deploy all Lambdas via CI

This is an opinionated setup for your API, where lambdas reside together. Obviously you could use this and then bring in lambdas as submodules or packages if you wanted to maintain seperate reops.

All assets within the lambda are wrapped up in a ZIP and pushed. Node modules can be easily added. Packages that require more advanced processing may need to be [compiled against lambda infrastucture](https://aws.amazon.com/blogs/compute/nodejs-packages-in-lambda/), but this is rare. There are a [few](https://medium.com/@kirkstrobeck/aws-lambda-node-modules-176f89471364) built-in Node modules that are available.

### Usage

This project has a detailed example in `./example`. To run the example, `cd` into that directory, `npm_install`, run commands from there.

#### Run

To run a Lambda, make a file called `event.js` that consists of `module.exports` of whatever input you’d give the lambda, which is often just JSON, then use the run command below with the name of the folder (and lambda).

```bash
node node_modules/lambdakit --run=weather
```

#### Deploy

To deploy, simply have the config in place (see below), then run the following command. It will `npm install` inside each lambda, wrap it up in a ZIP, then inject it into your AWS stack, *BAM*! Currently it rolls thru all lambdas.

```bash
node node_modules/lambdakit --deploy
```

### Config

1) Add this to `package.json` (You can omit if your values are the same as these are defaults).

```json
"lambdakit": {
  "region": "us-east-1",
  "path-to-lambdas": "/lib"
}
```

- `region` the AWS region where your Lambdas reside
- `path-to-lambdas` is the path to the folder that holds the lambdas. Currently each folder that holds lambda contents needs to match the lambda name in AWS.

2) Add `config.lambdakit.js` for local deploy (You can omit if using [local cli config](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-quick-configuration). Contents:

```js
process.env.AWS_ACCESS_KEY_ID = 'XXX';
process.env.AWS_SECRET_ACCESS_KEY = 'XXX';
```

2b) To deploy on commit from your CI server, install credentials on your project in the CI settings. In the case of [CircleCI](https://circleci.com), it’s done with a URI similar to `https://circleci.com/gh/myOrg/myProject/edit#aws`

3) Update your `.gitignore` to include the following, as your nested lambdas will be projects in and of themselves.

```bash
**/node_modules/**
/exports/*
/config.aws.lambda.js
```

## Roadmap

- Test coverage
- Deploy a single lambda
- Compare diff to only push changed lambdas
