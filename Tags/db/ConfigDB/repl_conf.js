configure={}

var hostName = "101PublicBu10";

configure.init = function(){
	rs.initiate();
	// wait for PRIMARY member up
	do{
		status = rs.status();
	}while( status.members[0].stateStr.localeCompare("PRIMARY") != 0 );

	// Add two new members
	rs.add(hostName+":27018");
	rs.add(hostName+":27019");
	
	var conf = rs.conf();
	
	// make 2nd member to be hidden SECONDARY (priority = 0, hidden = true)
	conf.members[1].priority = 0;
	conf.members[1].hidden = true;
	
	// make 3nd member to be an ARBITER (priority = 0, hidden = true, arbiterOnly=true)
	conf.members[2].priority = 0;
	conf.members[2].hidden = true;
	conf.members[2].arbiterOnly = true;
	conf.members[2].buildIndexes = false;
	
	// temprorily remove 2nd and 3rd members
	rs.remove(conf.members[1].host);
	rs.remove(conf.members[2].host);
	
	// force reconfigure
	rs.reconfig(conf, true);
	
	print("Wait for re-config process in 10s...");
	sleep(10000); // 10s
	
	print("Check the replica set configuration...")
	// validate the 3 members
	status = rs.status();
	if(status.members[0].stateStr.localeCompare("PRIMARY") == 0 &&
		status.members[1].stateStr.localeCompare("SECONDARY") == 0 &&
		status.members[2].stateStr.localeCompare("ARBITER") == 0 ){
		print(" ------------");
		print("|  FINISHED  |");
		print(" ------------ ");
	}
	else{
		print("Something was wrong!!!");
	}
}

configure.old = function() { 
    // Check replicaset status
	//rs.status();

	// It will choose one member of replicatset tobe primary
	// On mongo shell, run 'rs.status()' to check
	//rs.initiate();

	// We have three server
	var conf = {
		"_id" : "set1",
		"version" : 7,
		"protocolVersion" : NumberLong(1),
		"members" : [
				{
						"_id" : 0,
						"host" : "101PublicBu10:27017",
						"arbiterOnly" : false,
						"buildIndexes" : true,
						"hidden" : false,
						"priority" : 1,
						"tags" : {

						},
						"slaveDelay" : NumberLong(0),
						"votes" : 1
				},
				{
						"_id" : 1,
						"host" : "101PublicBu10:27018",
						"arbiterOnly" : false,
						"buildIndexes" : true,
						"hidden" : true,
						"priority" : 0,
						"tags" : {

						},
						"slaveDelay" : NumberLong(0),
						"votes" : 1
				},
				{
						"_id" : 2,
						"host" : "101PublicBu10:27019",
						"arbiterOnly" : true,
						"buildIndexes" : true,
						"hidden" : true,
						"priority" : 0,
						"tags" : {

						},
						"slaveDelay" : NumberLong(0),
						"votes" : 1
				}
		],
		"settings" : {
				"chainingAllowed" : true,
				"heartbeatIntervalMillis" : 2000,
				"heartbeatTimeoutSecs" : 10,
				"electionTimeoutMillis" : 10000,
				"getLastErrorModes" : {

				},
				"getLastErrorDefaults" : {
						"w" : 1,
						"wtimeout" : 0
				},
				"replicaSetId" : ObjectId("58280a0e25e639846e4930ef")
		}
	};
	
	//rs.initiate(conf);
	// reconfigure the server
	rs.reconfig(conf);
}
