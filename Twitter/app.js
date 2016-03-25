/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , home = require('./routes/home')
  , path = require('path')
	,connectionPool = require('./routes/connectionpool.js')
  , session = require('client-sessions');

var userStore = {}, app = express();
app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_0107058_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

connectionPool.createPool(50,100);

// all environments
app.set('port', process.env.PORT || 3010);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/', routes.index);
app.post('/afterSignUp', home.afterSignUp);
app.post('/afterSignIn', home.afterSignIn);
app.get('/signupform', home.signupform);
app.get('/signinform', home.signinform);
app.get('/success_login', home.success_login);
app.get('/fail_login', home.fail_login);
app.get('/SignUpSuccessful', home.redirectToLoginpage);
app.get('/redirecToLogin', home.redirecToLogin);
app.get('/getAllUsers', home.getAllUsers);
app.post('/followPeople', home.followPeople);
app.post('/tweetPeople', home.tweetPeople);
app.get('/getFollowingCount', home.getFollowingCount);
app.get('/getFollowingList', home.getFollowingList);
app.get('/getAllTweets', home.getAllTweets);
app.get('/getTweetCount', home.getTweetCount);
app.post('/checkIfHash', home.checkIfHash);
app.get('/getHashes', home.getHashes);
app.get('/getFollowerCount', home.getFollowerCount);
app.post('/insertTweet', home.insertTweet);
app.get('/showhashes', home.redirectToHashPage);
app.post('/searchtweet',home.searchtweet);
app.get('/logout',home.logout);
app.post('/retweet',home.retweet);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
