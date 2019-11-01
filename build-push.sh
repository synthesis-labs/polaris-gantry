mkdir repos
cd repos
git clone $1
cd $2
docker build -t $3 .
docker push $3