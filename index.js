const express = require("express");
const fs = require("fs");
const shell = require("shelljs");
const db = require("./db");
const bodyParser = require("body-parser");
const builder = require("./builder");
const watcher = require("./watcher");

const app = express();
const port = 3001;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

if (!fs.existsSync("/app/repos")) {
  shell.mkdir("/app/repos");
}

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
    builder.build(repo.value());
  }

  res.send();
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
setTimeout(watcher.watch, 10000);
