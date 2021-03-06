# Lambdakit

![](http://i.giphy.com/X35necnRanNG8.gif)

**A strategy for working with lambdas.**

[![Circle CI](https://circleci.com/gh/kirkstrobeck/lambdakit.svg?style=svg)](https://circleci.com/gh/kirkstrobeck/lambdakit)

- Run lambdas locally
- Deploy lambdas locally
- Deploy lambdas via CI

This is an opinionated setup for your API, where lambdas reside together. Obviously you can use this setup by bringing in lambdas as submodules or packages if you’d like to maintain seperate reops.

### Usage

```bash
npm install lambdakit
```

This project has a detailed example in `./example`. To run the example, `cd` into that directory, `npm_install`, and run commands from there.

#### Run

To run a lambda, make a file called `event.js` that consists of `module.exports` of whatever request you’d give the lambda, which is often just JSON, then use the run command below with the name of the folder/lambda.

```bash
node node_modules/lambdakit --run=weather
```

#### Deploy

To deploy, simply have the config in place (see below), then run the following command. It will `npm install` inside each lambda, wrap it all up in a ZIP, then inject it into your AWS stack, *BAM!*

```bash
# roll thru all lambdas
node node_modules/lambdakit --deploy
# deploy a specific lambda (ie. weather)
node node_modules/lambdakit --deploy=weather
```

Note: node modules can easily be added to each lambda. Packages that require more advanced processing may need to be [compiled against lambda infrastucture](https://aws.amazon.com/blogs/compute/nodejs-packages-in-lambda/), but this is rare. Keep in mind, there are a [few](https://medium.com/@kirkstrobeck/aws-lambda-node-modules-176f89471364) built-in node modules that are available.

### Config

1) Add this to `package.json` (You can omit if your values are the same as these are defaults)

```json
"lambdakit": {
  "region": "us-east-1",
  "path-to-lambdas": "/lib/lambdas",
  "path-to-lambdas": "/lib/shared",
  "prefix_with_branch_name": true
}
```

- `region`: the AWS region where your lambdas reside
- `path-to-lambdas`: is the path to the folder that holds the lambdas. Currently each folder that holds lambda contents needs to match the lambda name in AWS.
- `path-to-shared`: (optional) is the path to a shared resources folder that will get copied to the root of each applicable lambda on deploy and run.
- `prefix_with_branch_name`: (bool) If you are on the branch `beta`, then the lambda `weather` will deploy to `beta-weather`. This supports a branch-based stage strategy. You will need to create lambdas named for each branch/stage that deploys on AWS. This only affects deployment, not local development.

2) Add `config.aws.lambdakit.js` for local deploy (You can omit if using [local cli config](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-quick-configuration)

```js
process.env.AWS_ACCESS_KEY_ID = 'XXX';
process.env.AWS_SECRET_ACCESS_KEY = 'XXX';
```

2b) To deploy on commit from your CI, install creds on your project in the CI settings. In the case of [CircleCI](https://circleci.com), it’s done at the URI pattern `https://circleci.com/gh/myOrg/myProject/edit#aws`. See the `/example/circle.yml` for the CI command.

3) You’ll want to update your `.gitignore` to include the following, as your nested lambdas will be projects in and of themselves

```bash
**/node_modules/**
/exports/*
/config.aws.lambda.js
```

## Roadmap

- Test coverage
- Deploy a single lambda
- Compare diff to only push changed lambdas
