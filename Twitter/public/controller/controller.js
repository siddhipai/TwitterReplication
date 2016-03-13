  var app=angular.module('twitterSignIn',[]);
  app.controller('signInController', function($scope,$http){
		    	$scope.signin = function(){
		    			$http({
		    				method:"POST",
		    				url	  :'/afterSignIn',
		    				data  :{
		    					"fullnameLogin" : $scope.fullnameLogin,
		    					"passwordLogin" : $scope.passwordLogin
		    				}
		    			}).success(function(data) {
		    				//checking the response data for statusCode
		    				if (data.statusCode == 401) {
		    					$scope.invalid_login = false;
		    					$scope.unexpected_error = true;
		    				}
		    				else
		    					//Making a get call to the '/redirectToHomepage' API
		    				 
		    			}).error(function(error) {
		    				$scope.unexpected_error = false;
		    				$scope.invalid_login = true;
		    			});
		    	};
  });