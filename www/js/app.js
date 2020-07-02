const LOGS_DELAY = 5000;
var app = angular
.module('notifier',['ngSanitize'])
app.controller('AppController',function($scope,$interval,$http){
    $scope.page = 1;
    $scope.page_settings = 1;
    $scope.last_date_log = 0;
    $scope.logs = {};
    $scope.getSettings = function()
    {
        $http.get('/currentSettings')
        .then((res)=>{
            console.log(res.data);
        });
    }
    $scope.classLog = function(level)
    {
        if( level === 'info'  ) return 'log-info';
        if( level === 'warn'  ) return 'log-warn';
        if( level === 'error' ) return 'log-error';
        return '';
    }
    $scope.titleLog = function(level)
    {
        if( level === 'info'  ) return 'Общая информация';
        if( level === 'warn'  ) return 'Нужно обратить внимание';
        if( level === 'error' ) return 'Ошибка';
        return '';
    }
    $scope.convertTime = function(timestamp,format)
    {
        if(!format) format = 'LLL';
        return moment(timestamp).format(format);
    }
    $scope.clearLog = function()
    {
        this.logs = {};
    }
    $scope.set_logs = function(logs)
    {
        if(typeof logs !== 'object') return;
        for(var key in logs)
        {
            var log = logs[key];
            if(typeof log !== 'object') continue;
            if(typeof log.uuid === undefined) continue;
            this.logs[log.uuid] = log;
            if(log.timestamp>this.last_date_log) this.last_date_log = log.timestamp;
        }
    }
    $scope.getLogs = function()
    {
        var date_from = '';
        if(this.last_date_log > 0)
        {
            date_from = `&from=${this.last_date_log}`;
        }
        $http.get('/getLogs?limit=1000'+date_from)
        .then((res)=>{
            if( typeof res.data === 'object' && res.data.status )
            {
                this.set_logs(res.data.data);
            }
        });
    }
    $scope.selectGroupSettings = function(page_settings)
    {
        this.page_settings = page_settings;
    }
    $interval(()=>{
       if($scope.page == 2) $scope.getLogs();
    },LOGS_DELAY);
});