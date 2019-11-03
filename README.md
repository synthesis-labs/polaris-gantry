# Polaris Gantry (Work-in-progress)

**_Super simple docker build / push service inside Kubernetes._**

Builds and pushes docker images inside Kubernetes to AWS ECR. Two pods are spun up, one is an API to create and issue builds, the other is docker-in-docker to build and push images.

For now, state is stored in a json file on the container so deleting the pod refreshes the state.

## Install

```sh
$ kubectl apply -f https://raw.githubusercontent.com/synthesis-labs/polaris-gantry/master/polaris-gantry.yaml
$ kubectl port-forward 3001:80 svc/polaris-gantry
```

## Usage

1. Create repo

```
POST: http://localhost:3001/repos
GET: http://localhost:3001/repos
```

```js
{
  "name": "example", // Identifier for this repo
  "url": "https://<USERNAME>:<PASSWORD>@bitbucket.org/synthesis_admin/example.git", // Git repo, include credentials
  "tag": "535282574996.dkr.ecr.eu-west-1.amazonaws.com/example:latest", // Tag which includes docker registry to use
  "dockerfile": "images/example", // Dockerfile location inside the repo

  // TODO:
  "trigger": "commit" // none | commit
}
```

1. Issue a build

```
POST: http://localhost:3001/repos/REPO_NAME/build
```

Running the following inside a container in your cluster:

```sh
$ git clone
$ cd to_docker_file
$ docker login
$ docker build .
$ docker push
```

## Development

```sh
$ npm install
$ npm start
```

## TODO

- Tag with git commit
- Add trigger option for building on commit
- Read git credentials from secret
