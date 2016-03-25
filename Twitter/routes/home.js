var ejs = require("ejs");
var express = require('express');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var mysql = require('./mysql');
var session = require('client-sessions');

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
	var birthday = req.param("birthday");
	var phone = req.param("phone");
	var json_responses;

	if(fullname!== ''  && email!== '' && password!== '')
	{

					//Assigning the session
	var encryptedPassword = crypto
    .createHash("md5")
    .update(password)
	.digest('hex');


		var twitter_handle = '@' + fullname;
		var query = "insert into tbl_users(tweeter_handle,fullname, password,emailid)VALUES ('"+ twitter_handle + "','" + fullname + "','" +encryptedPassword+ "','" +email+"')";
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


function afterSignIn(req , res) {
	var emailid = req.param("fullnameLogin");
	var password = req.param("passwordLogin");
	var json_responses;
	var loginResults;
	var encryptedPassword = crypto
    .createHash("md5")
    .update(password)
	.digest('hex');

	var getUser="select * from tbl_users where emailid='"+emailid+"' and password='" + encryptedPassword +"'";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length > 0){
				if(emailid === results[0].emailid)
					{

					if(encryptedPassword === results[0].password)
					{
						req.session.fullname=results[0].fullname;
						req.session.twitterHandle=results[0].tweeter_handle;
					}
					}

				console.log("valid Login");
				ejs.renderFile('./views/homepage.ejs', { session: req.session.fullname  } , function(err, result) {
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
function getAllUsers(req,res){
	var twitterHandle=req.session.twitterHandle;
	var getUser="select * from tbl_users u where u.tweeter_handle NOT IN(select followingTwitterHandle from tbl_followers where followerTwitterHandle='"+ twitterHandle + "') and u.tweeter_handle != '" + twitterHandle + "'";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			for(var i=0;i<results.length;i++)
			{
				var jsonstring = JSON.stringify(results);

			}
			if(results.length > 0){

				res.send(results);

			}
			else {

				console.log("Invalid Login");
				res.send({"responseErrorCode": 401});
			}
		}
	},getUser);
}


function success_login(req,res)
{
	ejs.renderFile('./views/homepage.ejs',function(err, result) {
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

function followPeople(req , res) {

	var followerHandle = req.session.twitterHandle;
	var followingHandle = req.param('tweeter_handle');
	var json_responses;
	if(followerHandle!== '' && followingHandle!== '')
	{
		var query = "insert into tbl_followers(followingTwitterHandle, followerTwitterHandle)VALUES ('"+ followingHandle + "','" +followerHandle+"')";
		mysql.insertData(function(err,results){
			if(err){
				throw err;
			}
			else
			{
				json_responses = {"status" : "following"};
				res.send(json_responses);
			}
		},query);
	}
	else
	{
		json_responses = {"status" : "+follow"};
		res.send(json_responses);
	}
}

function tweetPeople(req , res) {

	//var twitter_handle = req.param('twitterHandle')
	var twitterHandle=(req.session.twitterHandle);
	var tweetTA = req.param('tweetText');
	if(tweetTA!== '')
	{
		var query = "insert into tbl_tweet(tweettext,tweeter_handle,contain_hashtag)VALUES ('"+ tweetTA + "','"+twitterHandle +"', '"+ 0 +"')";
		mysql.insertData(function(err,results){
			if(err){
				throw err;
			}
			else
			{
				json_responses = {"status" : "Tweet Done"};
				res.send(json_responses);
			}
		},query);
	}
	else
	{
		json_responses = {"status" : "Tweet Failed"};
		res.send(json_responses);
	}
}


function getFollowingCount(req,res){
var twitterHandle=(req.session.twitterHandle);
	var getUser="select count(*) as followingCount from tbl_followers where followerTwitterHandle='"+twitterHandle+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length>0) {
				res.send(results);
			}
		}
	},getUser);
}

function getFollowerCount(req,res){
	var twitterHandle=(req.session.twitterHandle);
	var getUser="select count(*) as followerCount from tbl_followers where followingTwitterHandle='"+twitterHandle+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length>0) {
				res.send(results);
			}
		}
	},getUser);
}

function getTweetCount(req,res){
	var twitterHandle=(req.session.twitterHandle);
	var getUser="select count(*) as tweetCount from tbl_tweet where tweeter_handle='"+twitterHandle+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length>0) {
				res.send(results);
			}
		}
	},getUser);
}



function getFollowingList(req,res){
	var twitterHandle=(req.session.twitterHandle);

	var getUser="select * from tbl_followers where followerTwitterHandle='"+twitterHandle+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length>0) {
				res.send(results);
			}
		}
	},getUser);
}



function getAllTweets(req,res){
	var twitterHandle=(req.session.twitterHandle);

	var getUser="select a.fullname, a.tweeter_handle,b.tweettext,b.datetime_value,a.tweeter_handle,b.retweet_user from tbl_users a, tbl_tweet b where a.tweeter_handle = b.tweeter_handle and a.tweeter_handle in (select tweeter_handle from tbl_tweet where tweeter_handle IN (select followingTwitterHandle from tbl_followers where followerTwitterHandle ='"+req.session.twitterHandle+"') or tweeter_handle = '"+req.session.twitterHandle+"')";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length>0) {
				res.send(results);
			}
		}
	},getUser);
}



function logout(req,res)
{
	req.session.destroy();
	session = undefined;
	json_responses = {"status" : "success"};
	res.send(json_responses);

}

function insertTweet(req,res)
{
	var status = 0;
	var pos = req.body.tweetText.toString().indexOf("#");
	if(pos != -1) {
		var array = req.body.tweetText.toString().split("#");
		for (i in array) {
			if ((array[i].charAt(0) != " ") && (array[i].charAt(0)!= "")) {
				status = 1;
			}
		}
	}
	var inserttweet = "insert into tbl_tweet ( tweeter_handle,tweettext,Contain_Hashtag) VALUES ('" + req.session.twitterHandle + "','" + req.body.tweetText + "'," + status + ")";

mysql.insertData(function(err,result){
	if(err)
	{
		throw err;
	}
	else
	{
		for (i in array) {
			if (i!= 0)
			{
				puthash(array[i]);
			}
		}
	}
	var getTweet = "select u.fullname,t.tweettext,u.Tweeter_Handle,t.datetime_value FROM tbl_users u INNER join tbl_tweet t ON u.Tweeter_Handle = t.Tweeter_handle WHERE u.Tweeter_Handle = '"+req.session.twitterHandle+"'";
	mysql.fetchData(function(err,result){
		if(err)
		{
			throw err;
		}
		else
		{
			res.send(result);
		}
	},getTweet);

},inserttweet)
}


function puthash(array)
{
	var gettweetid = "select max(tweetid) as max from tbl_tweet;"
	mysql.fetchData(function(err,result) {
		if (err)
		{
			throw err;
		}

		else
		{
			if ((array != " ") && (array != "")) {
				var firstval = array.split(" ");
				if ((firstval[0].charAt(0) != " ") && (firstval[0].charAt(0) != ""))
				{
					inserthash(result[0].max, firstval[0]);
				}
			}
		}
	},gettweetid);
}

function inserthash(tweetid,hashval)
{
	var puthashval = "insert into tbl_hashtags(hashtags,twitterid) values (' " + hashval + "'," + tweetid + ");"
	mysql.fetchData(function(err,result) {
		if (err)
		{
			throw err;
		}

		else
		{
			//  console.log("SUCCESS IN HASH INSERT");

		}
	},puthashval);
}


function checkIfHash(req,res)
{

	var data;
	var searchHash = req.body.searchHash;


	if(searchHash.toString().charAt(0) == '#')
	{

		searchHash = searchHash.substr(1);
		req.session.searchValue = searchHash;
		data = {"statusCode" : 1};
		res.send(data);
	}
	else{
		data = {"statusCode" : -1};
		res.send(data);
	}
}

function getHashes(req,res)
{

	var hashValue =  req.session.searchValue;
	var getHashTweets = "SELECT t.tweettext,u.fullname,u.Tweeter_Handle FROM tbl_users u INNER JOIN tbl_tweet t on u.Tweeter_Handle = t.Tweeter_Handle INNER JOIN tbl_hashtags h on t.tweetid = h.twitterid WHERE hashtags = ' "+hashValue+"'";
	mysql.fetchData(function(err,result){
		if(err)
		{
			throw err;
		}
		else
		{
			res.send(result);
		}
	},getHashTweets);

}


function redirectToHashPage(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.searchValue)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("showhashes.ejs",{searchValue: req.session.searchValue});
	}
	else
	{
		res.redirect('/');
	}
};


exports.searchtweet = function(req,res){
	//get all tweets here
	var searchword = req.body.searchword;

	var query = 'select datetime_value,tweettext,tweeter_handle from tbl_tweet';
	mysql.fetchData(function(err,result){
		if(err)
		{
			throw err;
		}
		else {
			res.send({
				'redirect': 'search',
				'data': result
			});

		}

	},query);

}

exports.retweet = function(req,res){
	var tweet_from = req.body.owner;
	var tweet = req.body.text;
	var twitterHandle= req.session.twitterHandle;
	var query="insert into tbl_tweet (tweettext,tweeter_handle,Retweet_User) values ('"+tweet+"','"+twitterHandle+"','"+tweet_from+"')";
	mysql.fetchData(function(err,rows){
		if(err)
		{
			throw err;
		}
		else
		{
			if(rows.length>0) {
				res.send(rows);
			}
			else{
				res.send(200);
			}
		}
	},query);
}



exports.signinform = signinform;
exports.signupform = signupform;
exports.sign_in=sign_in;
exports.afterSignUp=afterSignUp;
exports.afterSignIn=afterSignIn;
exports.success_login=success_login;
exports.fail_login=fail_login;
exports.logout=logout;
exports.getAllUsers=getAllUsers;
exports.followPeople=followPeople;
exports.tweetPeople=tweetPeople;
exports.getFollowingCount=getFollowingCount;
exports.getFollowingList=getFollowingList;
exports.getTweetCount=getTweetCount;
exports.getAllTweets=getAllTweets;
exports.checkIfHash=checkIfHash;
exports.getHashes=getHashes;
exports.getFollowerCount=getFollowerCount;
exports.insertTweet=insertTweet;
exports.redirectToHashPage = redirectToHashPage;
exports.redirectToHashPage = redirectToHashPage;



