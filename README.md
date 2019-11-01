# Polaris Gantry

## **_Work-in-progress_**

---

Builds and pushes docker images inside kubernetes

## Install

```sh
$ kubectl apply -f https://github.com/synthesis-labs/polaris-gantry/polaris-gantry.yaml
$ kubectl port-forward 3001 polaris-gantry
```

## Usage

1. Create repo

```
POST: http://localhost:3001/repos
```

```json
{
  "name": "example",
  "url": "https://<USERNAME>:<PASSWORD>@bitbucket.org/synthesis_admin/example.git",
  "tag": "535282574996.dkr.ecr.eu-west-1.amazonaws.com/example:latest",
  "dockerfile": "images/example"
}
```

1. Issue build

```
POST: http://localhost:3001/repos/REPO_NAME/build
```

## Development

```sh
$ npm install
$ npm start
```
