var mysql = require('mysql');
var List = require("collections/list");
var maxPoolSize;
var connectionpool;
var connectioncount=0;

function getConnection() {
	var connection = mysql.createConnection({
        host     : "localhost",
        user     : "root",
        password : "qwerty@26145",
        database : 'twitterdatabase',
        port	 : 3307
	})
	return connection;
}

function createPool(initialSize,maxSize){
	console.log("Pool is created")
	connectionpool = new List();
	maxPoolSize = maxSize;
	for(var i=0;i<initialSize;i++){
		connectionpool.push(getConnection());
	}
}

function getConnectionFromPool(){
	if(connectionpool.length == 0){
		
		if(connectioncount!=maxSize){
		connectioncount++;
		console.log("connection given, used connections are :"+connectioncount);
		return getConnection();
		}
		else{
			console.log("No connections are available on connectionpool!!!")
			return null;
		}
	}else{
		connectioncount++;
		console.log("connection given, used connections are :"+connectioncount);
		return connectionpool.pop();
	}
	
}

function releaseConnection(connection){
	connectioncount--;
	console.log("connection released, used connections are :"+connectioncount);
	connectionpool.push(connection);
	
}

exports.createPool = createPool;
exports.getConnectionFromPool = getConnectionFromPool;
exports.releaseConnection = releaseConnection;