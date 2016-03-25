var ejs= require('ejs');
var mysql = require('mysql');
var connectionpool = require('./connectionpool');


function fetchData(callback,sqlQuery){

	
	var connection=connectionpool.getConnectionFromPool();

	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			callback(err, rows);
		}
	});
	connectionpool.releaseConnection(connection);
}	

function insertData(callback,sqlQuery){
	

	var connection=connectionpool.getConnectionFromPool();
	
	connection.query(sqlQuery, function(err, result) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			callback(err, result);
		}
	});
	console.log("\nConnection closed..");
	connectionpool.releaseConnection(connection);
}	

exports.insertData=insertData;
exports.fetchData=fetchData;