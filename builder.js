const fs = require("fs");
const shell = require("shelljs");
const helpers = require("./helpers");
const AWS = require("aws-sdk");
const ecr = new AWS.ECR({ region: "eu-west-1" });

var builds = 0;

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

module.exports.build = async repo => {
  console.log(`=== ${new Date().toISOString()} BUILD STARTED: ${repo.name} ===`);
  while (builds > 0) {
    await sleep(5000);
  }
  builds++;

  try {
    shell.cd("/app/repos");

    if (fs.existsSync(helpers.getRepoName(repo.url))) {
      shell.cd(helpers.getRepoName(repo.url));
      console.log("$ git pull");
      shell.exec("git pull");
    } else {
      console.log("$ git clone");
      shell.exec(`git clone ${helpers.getRepoUrl(repo.url)}`);
      shell.cd(helpers.getRepoName(repo.url));
    }

    console.log(`$ git checkout ${repo.branch}`);
    shell.exec(`git checkout ${repo.branch}`);

    console.log(`$ cd ${repo.buildDirectory}`);
    shell.cd(repo.buildDirectory);

    var data = await ecr.getAuthorizationToken().promise();

    var dockerToken = Buffer.from(data.authorizationData[0].authorizationToken, "base64")
      .toString("ascii")
      .split(":");
    var username = dockerToken[0];
    var password = dockerToken[1];

    console.log(`$ docker login -u ${username} -p ***** ${"https://" + repo.registry.split("/")[0]}`);
    shell.exec(`docker login -u ${username} -p ${password} ${"https://" + repo.registry.split("/")[0]}`);

    console.log(`$ docker build -t ${repo.registry}:latest -t ${repo.registry}:${helpers.getGitHash()} -f ${repo.dockerfile} . --network=host`);
    shell.exec(`docker build -t ${repo.registry}:latest -t ${repo.registry}:${helpers.getGitHash()} -f ${repo.dockerfile} . --network=host`);

    console.log(`$ docker push ${repo.registry}`);
    shell.exec(`docker push ${repo.registry}`);

    console.log(`=== ${new Date().toISOString()} BUILD COMPLETED: ${repo.name} ===`);
    builds--;
  } catch (ex) {
    console.error(ex);
    console.log(`=== ${new Date().toISOString()} BUILD FAILED: ${repo.name} ===`);
    builds--;
  }
};
