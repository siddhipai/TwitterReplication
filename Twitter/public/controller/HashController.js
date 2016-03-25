var twitterHashPage = angular.module('twitterHashPage',[]);

twitterHashPage.controller('hashController', ['$scope', '$http', function($scope, $http,$location) {

    $http.get('/getHashes').success(function (response) {

        if (response == undefined || response == null || response[0] == null || response.responseErrorCode == 401) {
            console.log("No hashes in database");
        }
        else {

            $scope.hashes = response;
            console.log($scope.hashes);
        }

    });

}]);