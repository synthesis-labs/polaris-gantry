const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const builder = require("./builder");
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
  if (repo.value() == undefined) {
    console.error(`No repo named ${req.params.name}, see all repos with GET: /repos`);
  } else {
    ecr.getAuthorizationToken({}, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
        var dockerToken = Buffer.from(data.authorizationData[0].authorizationToken, "base64")
          .toString("ascii")
          .split(":");
        var username = dockerToken[0];
        var password = dockerToken[1];

        builder.build(repo.value(), username, password);
      }
    });
  }

  res.send();
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
