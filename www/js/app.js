const LOGS_DELAY = 5000;
const MAX_COUNT_LOGS = 500;
function downScroll(ScrollDom,PositionDom)
{
    $(ScrollDom).scrollTop($(PositionDom).height());
}

var app = angular
.module('notifier',['ngSanitize'])
app.controller('AppController',function($scope,$interval,$http){
    $scope.page = 1;
    $scope.page_settings = 1;
    $scope.last_date_log = 0;
    $scope.logs = {};
    $scope.autoScrollLogs = true;
    $scope.findOldLog = function()
    {
        var minLog = undefined;
        for(var key in this.logs)
        {
            var log = this.logs[key];
            if(minLog === undefined) 
            {
                minLog = log;
                continue;
            }
            var validMinLog = typeof minLog === 'object'; 
            var validLog = typeof log.timestamp === 'number';
            if( validMinLog && validLog )
            {
                if(minLog.timestamp >= log.timestamp ) minLog = log
            }
            continue;
        }
        return minLog;
    }
    $scope.checkClearLog = function()
    {
        if( this.countLog >= MAX_COUNT_LOGS )
        {
            var minLog = $scope.findOldLog();
            var validMinLog  = typeof minLog === 'object' && typeof minLog.timestamp === 'number';
            if(validMinLog)
            {
                var ok = typeof this.logs[minLog.uuid] === 'object';
                delete this.logs[minLog.uuid];
                if(ok) this.countLog--;
            }
        }
    }
    $scope.downloadLog = function()
    {

    }
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
    $scope.findLog = function(log)
    {
        var validLog = typeof log === 'object' && typeof log.module === 'string' && typeof log.message === 'string';
        var validFilterLog = this.filterLog && this.filterLog !== undefined && this.filterLog !== '' && typeof this.filterLog ==='string'; 
        if( validFilterLog && validLog )
        {
            let module = log.module.toLowerCase();
            let message = log.message.toLowerCase();
            let filterLog = this.filterLog.toLowerCase();
            if(module.indexOf(filterLog)>-1) return true;
            if(message.indexOf(filterLog)>-1) return true;
            if(filterLog.indexOf(message)>-1) return true;
            if(filterLog.indexOf(module)>-1) return true;
            return false;
        }
        return true;
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
    $scope.scrollLog = function()
    {
        if(this.autoScrollLogs)
        {
            downScroll('.table-logs-container','.table-logs');
        }
    }
    $scope.set_logs = function(logs)
    {
        if(this.countLog === undefined) this.countLog = 0;
        if(typeof logs !== 'object') return;
        for(var key in logs)
        {
            var log = logs[key];
            if(typeof log !== 'object') continue;
            if(typeof log.uuid === undefined) continue;
            if(this.logs[log.uuid] === undefined)  this.countLog++;
            this.logs[log.uuid] = log;
            if(log.timestamp>this.last_date_log) this.last_date_log = log.timestamp;
            this.checkClearLog();
        }
        this.scrollLog();
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
})
.filter('filter_object',function(){
    return function(items)
    {
        try
        {
            var temp = [];
            for (var key in items)
            {
                temp.push(items[key]);
            }
            return temp;
        }
        catch (err)
        {
            return [];
        }
    }
});