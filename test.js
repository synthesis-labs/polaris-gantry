const helpers = require("./helpers");

console.log(
  helpers.getRepoUrl("https://builduser:password1@bitbucket.org/synthesis_admin/example.git")
);

console.log(
  helpers.getRepoUrl("https://builduser@bitbucket.org/synthesis_admin/example.git")
);

console.log(
  helpers.getRepoUrl("https://bitbucket.org/synthesis_admin/example.git")
);
