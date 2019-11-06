const fs = require("fs");
const _ = require("lodash");
const shell = require("shelljs");
const db = require("./db");
const builder = require("./builder");
const helpers = require("./helpers");

var hashHistory = [];

module.exports.watch = () => {
  try {
    var repos = db
      .get("repos")
      .filter({ trigger: "commit" })
      .value();

    repos.forEach(async repo => {
      shell.cd("/app/repos");
      //   console.debug(`Checking ${repo.name}`);

      if (fs.existsSync(helpers.getRepoName(repo.url))) {
        shell.cd(helpers.getRepoName(repo.url));
        shell.exec(`git checkout ${repo.branch}`, { silent: true });
        shell.exec("git pull", { silent: true });
        currentHash = helpers.getGitHash();

        var previousHash = _.find(hashHistory, { repo: repo.name });
        if (previousHash == undefined) {
          hashHistory.push({ repo: repo.name, previousHash: currentHash });
          console.log(`No build history, kicking off build ${currentHash}`);
          await builder.build(repo);
        } else if (previousHash.previousHash !== currentHash) {
          previousHash.previousHash = currentHash;
          //   console.debug(hashHistory);
          console.log(`Found changes, kicking off build ${currentHash}`);
          await builder.build(repo);
        } else {
          //   console.debug(`No changes (Previous: ${previousHash.previousHash}, current: ${currentHash})`);
          //   console.debug(hashHistory);
        }
      } else {
        console.log("New repo, haven't pulled yet... Kicking off build");
        await builder.build(repo);
      }
    });
  } catch (ex) {
    console.log("Watcher failed");
  }

  setTimeout(module.exports.watch, 10000);
};
