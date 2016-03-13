var ejs = require("ejs");
var express = require('express');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var mysql = require('./mysql');

var session;
function sign_in(req,res) {

	ejs.renderFile('./views/signin.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

//After opting for sign up
function signupform(req,res) {
	ejs.renderFile('./views/signup.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

//After opting for sign in
function signinform(req,res) {

	console.log("DDD");
	ejs.renderFile('./views/signinform.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

function afterSignUp(req , res) {
	var fullname = req.param("fullname");
	var email = req.param("phoneOrEmail");
	var password = req.param("password");
	var json_responses;
	
	if(fullname!== ''  && email!== '' && password!== '')
	{
		console.log(fullname+" "+email+" "+password);
					//Assigning the session
		var twitter_handle = '@' + fullname;
		var post  = {twitter_handle : twitter_handle, name : fullname, password : password, emailid : email};
		var query = "insert into tbl_users(tweeter_handle,fullname, password, emailid)VALUES ('"+ twitter_handle + "','" + fullname + "','" +password+ "','" +email+"')";	
		mysql.insertData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
			req.session.fullname = fullname;
			console.log("Session initialized");
			json_responses = {"statusCode" : 200};
			res.send(json_responses);
			}
		},query);
	}
	else
	{
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
	}
	

	
exports.redirectToLoginpage = function(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.fullname)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("SignUpSuccessful",{fullname:req.session.fullname});
	}
	else
	{
		res.redirect('/');
	}
};


exports.redirecToLogin = function(req,res)
{

		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("signinform.ejs");

};
	
//	if (fullname === null || password === null || phoneOrEmail === null)
//		{
//			res.send("Failure");
//		}
//	else
//		{
//		//console.log(fullname + " " + password + "*************");
//		res.send("Success");
////		var hash = crypto
////	     .createHash("md5")
////	     .update(req.body.pass)
////	     .digest('hex');
////
////		console.log(hash);
//		var twitter_handle = '@' + fullname;
//		var post  = {twitter_handle : twitter_handle, name : fullname, password : password, emailid : phoneOrEmail};
//		
//		
//			var query = "insert into tbl_users(name, password, email)VALUES ("+ fullname + "," +password+ "," +phoneOrEmail+")";	
//			
//			
//		}
	



function afterSignIn(req , res) {
var emailid = req.param("fullnameLogin");
var password = req.param("passwordLogin");
var json_responses;
var getUser="select * from tbl_users where emailid='"+emailid+"' and password='" + password +"'";
console.log("Query is:"+getUser);

mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}
	else 
	{
		if(results.length > 0){
			console.log("valid Login");
			ejs.renderFile('./views/success_login.ejs', { data: results } , function(err, result) {
		        // render on success
		        if (!err) {
		            res.end(result);

		        }
		        // render or error
		        else {
		            res.end('An error occurred');
		            console.log(err);
		        }
		    });
		}
		else {    
			
			console.log("Invalid Login");
			ejs.renderFile('./views/fail_login.ejs',function(err, result) {
		        // render on success
		        if (!err) {
		            res.end(result);
		        }
		        // render or error
		        else {
		            res.end('An error occurred');
		            console.log(err);
		        }
		    });
		}
	}  
},getUser);
}


function success_login(req,res)
{
	ejs.renderFile('./views/success_login.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });

}


function fail_login(req,res)
{
	ejs.renderFile('./views/fail_login.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}
function logout(req,res)
{
	console.log("here in logout");
	res.render('./views/signin.ejs');
    session = undefined;   
}

exports.signinform = signinform;
exports.signupform = signupform;
exports.sign_in=sign_in;
exports.afterSignUp=afterSignUp;
exports.afterSignIn=afterSignIn;
exports.success_login=success_login;
exports.fail_login=fail_login;
exports.logout=logout;