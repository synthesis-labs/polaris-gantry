const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const shell = require("shelljs");

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

  console.log("===================================");
  console.log(`POST: /repos/${req.params.name}/build`);
  console.log(JSON.stringify(repo, 0, 2));

  shell.exec(`./build-push.sh ${repo.value().url} ${repo.value().dockerfile} ${repo.value().tag}`);

  res.send();
});

const server = app.listen(port, () => console.log(`Listening on port ${port}!`));

// Increase the timeout to 10 minutes
server.timeout = 600000;
