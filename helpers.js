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
