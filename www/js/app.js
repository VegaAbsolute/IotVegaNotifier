var app = angular
.module('notifier',['ngSanitize'])
app.controller('AppController',function($scope,$timeout,$http){
    $scope.page = 1;
    $scope.page_settings = 1;
    $scope.getSettings = function()
    {
        $http.get('/currentSettings')
        .then((res)=>{
            console.log(res.data);
        });
    }
    $scope.selectGroupSettings = function(page_settings)
    {
        this.page_settings = page_settings;
    }
});