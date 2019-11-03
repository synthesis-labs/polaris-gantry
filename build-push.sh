echo $ mkdir repos
mkdir repos

echo $ cd repos
cd repos

echo $ git clone $1
git clone $1

echo $ cd $2
cd $2

echo $ docker login -u $4 -p ***** $6
docker login -u $4 -p $5 $6

echo $ docker build -t $3 . --network=host
docker build -t $3 . --network=host

echo $ docker push $3
docker push $3