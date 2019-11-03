mkdir repos
cd repos
git clone $1
cd $2
docker build -t $3 . --network=host
docker push $3