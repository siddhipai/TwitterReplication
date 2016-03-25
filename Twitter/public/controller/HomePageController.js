  var twitterHomepage = angular.module('twitterHomepage',[]);

  twitterHomepage.controller('followController', ['$scope', '$http', function($scope, $http,$location) {


	  $http.get('/getFollowerCount').success(function(response){


		  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
			  $scope.followerCount = 0;


		  }
		  else{
			  $scope.followerCount = response[0].followerCount;

		  }

	  });

	  $http.get('/getAllUsers').success(function(response){

		  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
			  console.log("No users in database");
		  }
		  else{

			  $scope.users=response;
		  }

	  });

	  $http.get('/getFollowingCount').success(function(response){

		  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
			  $scope.followingCount = 0;
		  }
		  else{
			  $scope.followingCount = response[0].followingCount;
		  }

	  });

	  $http.get('/getTweetCount').success(function(response){

		  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
			  $scope.tweetCount = 0;
		  }
		  else{
			  $scope.tweetCount = response[0].tweetCount;
		  }

	  });


	  $http.get('/getAllTweets').success(function(response){

		  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
			  console.log("No tweets in database");
		  }
		  else{

			  $scope.tweetDescription=response;

		  }

	  });

	  $scope.fetchFollowingCount = function () {

		  $http({
			  method: "GET",
			  url: '/getFollowingCount'
		  }).success(function (response) {
			  //checking the response data for statusCode
			  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
				  $scope.followingCount = 0;
			  }
			  else{

				  $scope.followingCount = response[0].followingCount;

			  }
		  }).error(function (error) {

		  });
	  };

	  $scope.buttonText = "+Follow";
	  $scope.follow_handle = function(obj,$event){
		  var currentText = angular.element($event.target).text();
		  currentText = currentText == '+Follow'? 'Following!' : '+Follow';
		  angular.element($event.target).text(currentText);

		  $scope.follow(obj);
	  }


	  $scope.follow = function (tweeter_handle) {

		  $http({
			  method: "POST",
			  url: '/followPeople',
			  data: {
				  //"twitterHandle" : $scope.user.tweeter_handle,
				  "tweeter_handle": tweeter_handle
			  }
		  }).success(function (data) {
			  //checking the response data for statusCode
			  if (data.status == "following") {
				  $scope.followingStatus = "following";
				  $scope.fetchFollowingCount();
			  }
			  else {
				  //Making a get call to the '/redirectToHomepage' API
				  $scope.followingStatus = "follow";

			  }
		  }).error(function (error) {

		  });
	  };

	  $scope.fetchTweetCount = function () {
		  console.log("Inside fetch");
		  $http({
			  method: "GET",
			  url: '/getTweetCount'
		  }).success(function (response) {
			  //checking the response data for statusCode
			  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
				  $scope.tweetCount = 0;
			  }
			  else{

				  $scope.tweetCount = response[0].tweetCount;

			  }
		  }).error(function (error) {

		  });
	  };


	  $scope.tweet = function () {

		  $http({
			  method: "POST",
			  url: '/insertTweet',
			  data: {
				  //"twitterHandle" : $scope.user.tweeter_handle,
				  "tweetText": $scope.textAreaTweet
			  }
		  }).success(function (response) {
			  //checking the response data for statusCode
			  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
				  console.log("No users in database");
			  }
			  else{

				  $scope.fetchTweetCount();
				  $scope.showTweetList();

			  }

		  }).error(function (error) {

		  });
	  };

	  $scope.showFollowingList = function () {

		  $http({
			  method: "GET",
			  url: '/getFollowingList'
		  }).success(function (response) {
			  //checking the response data for statusCode
			  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
				  console.log("No users in database");
				  $scope.following="nothing";
			  }
			  else{

				  $scope.following=response;
				  console.log($scope.users);
			  }
		  }).error(function (error) {

		  });
	  };

	  $scope.showTweetList = function () {

		  $http({
			  method: "GET",
			  url: '/getAllTweets'
		  }).success(function (response) {
			  //checking the response data for statusCode
			  if(response==undefined || response==null ||response[0]==null|| response.responseErrorCode == 401){
				  console.log("No users in database");
				  //$scope.tweetDescription=" ";
			  }
			  else{

				  $scope.tweetDescription=response;

			  }
		  }).error(function (error) {

		  });
	  };

	  $scope.searchHashTags = function () {

		  $http({
			  method: "POST",
			  url: '/checkIfHash',
			  data: {

				  "searchHash": $scope.searchTags
			  }
		  }).success(function (data) {
			  //checking the response data for statusCode
			  if (data.statusCode == 1) {
				  console.log($scope.searchTags);
				  window.location.assign("/showhashes");
			  }
			  else
			  if (data.statusCode == -1)
				  console.log("error occurred in hash search");
			  //Making a get call to the '/redirectToHomepage' API

		  }).error(function (error) {

		  });
	  };



	  $scope.logout = function () {
		 // console.log("Inside fetch");
		  $http({
			  method: "GET",
			  url: '/logout'
		  }).success(function (response) {
			  //checking the response data for statusCode
			  if(response.status=="success"){
			  window.location.assign("/signinform");
			  }
			   }).error(function (error) {
		  }).error(function (error) {

		  });
	  };


	  $scope.searchtweet = function(searchword){
		  var data = {
			  'searchword' : searchword
		  };
		  $http.post('/searchtweet',data).success(function(data,status){
			 console.log(data);
			   $scope.searchfeed = data.data;

		  })
	  }

	  $scope.searchwatch = function(){
		  var textlength = $scope.searchtext.length;
		  console.log('watching');
		  if(textlength == 0)
			  $scope.searchform.$setPristine();
	  }




	  $scope.retweet = function(selection){
		  var owner = angular.element(selection.target).attr('data-owner');
		  var text =  angular.element(selection.target).attr('data-text');
		  var data = {
			  'owner': owner,
			  'text':text
		  }
		  console.log(data)
		  $http.post('/retweet',data).success(function(data){
			  console.log("bbbbbbbbbbbb"+data);
		  }).then(function(){
			  $scope.showTweetList();
			  $scope.fetchTweetCount();

		  })
	  }



  }]);





