const shell = require("shelljs");
const fs = require("fs");

function getRepoName(url) {
  var repoUrlSplit = url.split("/");
  return repoUrlSplit[repoUrlSplit.length - 1].substr(
    0,
    repoUrlSplit[repoUrlSplit.length - 1].length - 4
  );
}

function getGitHash() {
  return require("child_process")
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();
}

module.exports.build = (repo, dockerUsername, dockerPassword) => {
  console.log(`=== BUILD STARTED: ${repo.name} ===`);
  try {
    if (!fs.existsSync("repos")) {
      shell.mkdir("repos");
    }

    shell.cd("repos");

    if (fs.existsSync(getRepoName(repo.url))) {
      shell.cd(getRepoName(repo.url));
      console.log("$ git pull");
      shell.exec("git pull");
    }
    else {
      console.log("$ git clone");
      shell.exec(`git clone ${repo.url}`);
      shell.cd(getRepoName(repo.url));
    }

    console.log(`$ git checkout ${repo.branch}`);
    shell.exec(`git checkout ${repo.branch}`);

    console.log(`$ cd ${repo.dockerfile}`);
    shell.cd(repo.dockerfile);

    console.log(`$ docker login -u ${dockerUsername} -p ***** ${"https://" + repo.registry.split("/")[0]}`);
    shell.exec(`docker login -u ${dockerUsername} -p ${dockerPassword} ${"https://" +repo.registry.split("/")[0]}`);

    console.log(`$ docker build -t ${repo.registry}:latest -t ${repo.registry}:${getGitHash()} . --network=host`);
    shell.exec(`docker build -t ${repo.registry}:latest -t ${repo.registry}:${getGitHash()} . --network=host`);

    console.log(`$ docker push ${repo.registry}`);
    shell.exec(`docker push ${repo.registry}`);

    console.log(`=== BUILD COMPLETED: ${repo.name} ===`);
  } catch (ex) {
    console.error(ex);
    console.log(`=== BUILD FAILED: ${repo.name} ===`);
  }
};
