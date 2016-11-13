::get current dir path
SET curDir=%~dp0

::clean
net stop "Mongod 27017"
net stop "Mongod 27018"
net stop "Mongod 27019"

sc delete "Mongod 27017"
sc delete "Mongod 27018"
sc delete "Mongod 27019"

rmdir /s /q d1 d2 d3

::create and run mongod services
::create db paths
mkdir d1
mkdir d2
mkdir d3
::run the primary member
mongod --replSet set1 --dbpath %curDir%d1 --port 27017 --install --serviceName "Mongod 27017" --serviceDisplayName "Mongod 27017" --smallfiles --logpath %curDir%d1/log.log

::run the hidden secondary memeber
mongod --replSet set1 --dbpath %curDir%d2 --port 27018 --install --serviceName "Mongod 27018" --serviceDisplayName "Mongod 27018" --smallfiles --logpath %curDir%d2/log.log
::run the arbiter
mongod --replSet set1 --dbpath %curDir%d3 --port 27019 --install --serviceName "Mongod 27019" --serviceDisplayName "Mongod 27019" --smallfiles --logpath %curDir%d3/log.log

::srart services
net start "Mongod 27017"
net start "Mongod 27018"
net start "Mongod 27019"

::configure the replica set
::mongo --port 27017 --shell repl_conf.js

PAUSE