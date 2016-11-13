1. Navigate to folder that you want the db to be located
Example: cd D:/data/db

2. Create mongodb services and run them as a replica set
Run this file:

	Run_db_replicaset.bat

3. Configure the replica set
- Modify your HOSTNAME in repl_conf.js

	var hostName = your_host_name;

  Example: var hostName = "101PublicBu10";

- In CMD, run:

	mongo --port 27017 --shell repl_conf.js

4. It will bring up the Mongo Shell
In Mongo Shell, run this command:
	configure.init()


5. Restore the database dump\coffeeshop2

	mongorestore /d coffeeshop2 dump\coffeeshop2