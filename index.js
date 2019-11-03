const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const shell = require("shelljs");
const AWS = require("aws-sdk");
const ecr = new AWS.ECR({ region: "eu-west-1" });

const app = express();
const port = 3001;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello polaris gantry!"));
app.get("/repos", (req, res) => res.send(db.get("repos")));

app.post("/repos", (req, res) => {
  db.get("repos")
    .push(req.body)
    .write();

  res.send();
});

app.post("/repos/:name/build", (req, res) => {
  var repo = db.get("repos").find({ name: req.params.name });

  console.log("======================================================================");
  console.log(`POST: /repos/${req.params.name}/build`);
  console.log(JSON.stringify(repo, 0, 2));

  ecr.getAuthorizationToken({}, function(err, data) {
    if (err) console.log(err, err.stack);
    else {
      var dockerToken = Buffer.from(data.authorizationData[0].authorizationToken, "base64")
        .toString("ascii")
        .split(":");
      var username = dockerToken[0];
      var password = dockerToken[1];

      // prettier-ignore
      shell.exec(`./build-push.sh ${repo.value().url} ${repo.value().dockerfile} ${repo.value().tag} ${username} ${password} ${repo.value().url.split("/")[0]}`);
      console.log("======================================================================");
    }
  });

  res.send();
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
