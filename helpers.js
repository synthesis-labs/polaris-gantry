module.exports.getRepoName = url => {
  var repoUrlSplit = url.split("/");
  return repoUrlSplit[repoUrlSplit.length - 1].substr(
    0,
    repoUrlSplit[repoUrlSplit.length - 1].length - 4
  );
};

module.exports.getGitHash = () => {
  return require("child_process")
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();
};

module.exports.getRepoUrl = ( repoUrl ) => {
  var password = process.env.GANTRY_GIT_PASSWORD;

  var x = repoUrl.split(":");
  var y = repoUrl.split("@");
  
  if (x.length == 3 && password) {
    return `${x[0]}:${x[1]}:${password}@${repoUrl.split("@")[1]}`;
  } else if (x.length == 2 && y.length == 2 && password) {
    return `${y[0]}:${password}@${y[1]}`;
  } else {
    return repoUrl;
  }
};
