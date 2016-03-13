var ejs= require('ejs');
var mysql = require('mysql');

function getConnection(){
	console.log("***");
	var connection = mysql.createConnection({
	    host     : "localhost",
	    user     : "root",
	    password : "qwerty@26145",
	    database : 'twitterdatabase',
	    port	 : 3307
	});
	return connection;
}


function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	console.log(connection);
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	

function insertData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, result) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+result);
			callback(err, result);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	

exports.insertData=insertData;
exports.fetchData=fetchData;