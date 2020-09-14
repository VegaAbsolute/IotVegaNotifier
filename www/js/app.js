const LOGS_DELAY = 5000;
const MAX_COUNT_LOGS = 500;
const RELOAD_PAGE_MS = 10000;
function downScroll(ScrollDom,PositionDom)
{
    $(ScrollDom).scrollTop($(PositionDom).height());
}
class Settings
{
    constructor()
    {
        this._administrator={};
        this._system={};
        this._smpp={};
        this._smsc={};
        this._smtp={};
        this._telegram={
            proxy_status:false
        };
        this._ws={};
        this._http={};
    }
    clear()
    {
        this._administrator={};
        this._system={};
        this._smpp={};
        this._smsc={};
        this._smtp={};
        this._telegram={
            proxy_status:false
        };
        this._ws={};
        this._http={};
    }
    set_data_settings(conf)
    {
        this.clear();
        this.copyObject(conf._administrator,'_administrator');
        this.copyObject(conf._system,'_system');
        this.copyObject(conf._smpp,'_smpp');
        this.copyObject(conf._smsc,'_smsc');
        this.copyObject(conf._smtp,'_smtp');
        this.copyObject(conf._telegram,'_telegram');
        this.copyObject(conf._ws,'_ws');
        this.copyObject(conf._http,'_http');
    }
    clone()
    {
        var clone = {};
        //Смотрим все что есть в классе
        for(var key in this)
        {
            var item = this[key];
            //если это не функция и не метод тогда можно это клонировать
            if(typeof item !== 'function')
            {
                //Если объект то просто скопировать не выйдет, иначе копируем.
                if( typeof item === 'object' ) 
                {
                    //объединяем без ссылок, предварительно очистив объект
                    clone[key] = {};
                    Object.assign(clone[key], item);
                    //Проверяем если есть объекты внутри
                    //ВНИМАНИЕ если может быть внутри несколько объектов работать не будет! 
                    var objects = this.findObjects(item);
                    //Если всетаки есть внутри объекты то мы их скопируем.
                    if(objects.length > 0)
                    {
                        objects.forEach(element => {
                            clone[key][element] = {};
                            Object.assign(clone[key][element], item[element]);
                        });
                    }
                }
                else 
                {
                    clone[key] = item;
                }
            }
        }
        return clone;
    }
    findObjects(obj)
    {
        var res = [];
        for(var key in obj)
        {
            if(typeof obj[key] === 'object') res.push(key);
        }
        return res;
    }
    copyObject(obj, where)
    {
        if(typeof obj !== 'object' || typeof this[where] !== 'object') return;
        for(var key in obj)
        {
            if( typeof obj[key] === 'object' )
            {
                Object.assign(this[where][key], obj[key]);
            }
            else this[where][key] = obj[key];
        }
    }
}
var app = angular
.module('notifier',['ngSanitize'])
.directive('ngEnter',function(){
    return function(scope,element,attrs){
      element.bind('keydown keypress',function(event){
          if(event.which==13){
              scope.$apply(function(){
                  scope.$eval(attrs.ngEnter,{'event':event});
              });
              event.preventDefault();
          }
      });  
    };
});
app.controller('AppController',function($scope,$interval,$timeout,$http){
    $scope.page_settings = 1;
    $scope.last_date_log = 0;
    $scope.logs = {};
    $scope.autoScrollLogs = true;
    $scope.settings = new Settings();
    $scope.edit_settings = {};
    
    $scope.enter_input = function()
    {
        if(!this.login) return;
        if(!this.password) return;
        this.authorization();
    }
    $scope.authorization = function()
    {
        $http.post('/authorization', {login:this.login,password:this.password})
        .then((res)=>{
            if(res.data.status)
            {
                $scope.page = 1;
                localStorage.token = res.data.token;
                $scope.getSettings();
                $interval(()=>{
                if($scope.page == 2) $scope.getLogs();
                },LOGS_DELAY);
            }
            else
            {
                alert('Не удалось авторизоваться.');
            }
        });
    }
    $scope.refresh_settings = function(conf)
    {
        this.settings.set_data_settings(conf);
        this.edit_settings = this.settings.clone();
    }
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
        var link = document.createElement('a');
        link.setAttribute('href','/downloadLogFile?token='+localStorage.token);
        link.setAttribute('target','_blank');
        link.click();
        return false;
    }
    $scope.clearToken = function()
    {
        delete localStorage.token;
        this.reloadPage();
    }
    $scope.reloadPage = function()
    {
        $scope.page = 'load';
        $timeout(()=>{
            location.reload();
        },RELOAD_PAGE_MS);

    }
    $scope.saveSettings = function()
    {
        this.edit_settings.token = localStorage.token;
        $http.post('/saveSettings', this.edit_settings)
        .then((res)=>{
            if(res.data && typeof res.data === 'object')
            {
                if(res.data.status)
                {
                    alert('Настройки были успешно сохранены. Внимание приложение перезапустится через несколько секунд, интерфейс будет временно недоступен.');
                    $scope.reloadPage();
                }
                else if(res.data.error === 'auth') $scope.clearToken();
                else alert('Не удалось сохранить настройки. ERROR '+res.data.error);
                
            }
            else
            {
                alert('Не удалось сохранить настройки. ERROR 2');
            }
        });
    }
    $scope.getSettings = function()
    {
        $http.get('/currentSettings?token='+localStorage.token)
        .then((res)=>{
            if(res.data && typeof res.data === 'object')
            {
                if(res.data.status) $scope.refresh_settings(res.data.data);
                else if(res.data.error === 'auth') $scope.clearToken();
                else alert('Не удалось запросить настройки. ERROR '+res.data.error);
            }
            else
            {
                alert('Не удалось запросить настройки. ERROR 1');
            }
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
        this.countLog = 0;
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
        $http.get('/getLogs?limit=1000'+date_from+'&token='+localStorage.token)
        .then((res)=>{
            if( typeof res.data === 'object' )
            {
                if(res.data.status) this.set_logs(res.data.data);
                else if(res.data.error === 'auth') $scope.clearToken();
                else alert('Не удалось запросить логи приложения. ERROR '+res.data.error);
            }
            else
            {
                alert('Не удалось запросить логи приложения. ERROR 3');
            }
        });
    }
    $scope.selectGroupSettings = function(page_settings)
    {
        this.page_settings = page_settings;
    }
    $scope.init = function()
    {
        var token = localStorage.token;
        if(!token)
        {
            $scope.page = 'auth';
        }
        else
        {
            this.page = 1;
            this.getSettings();
            $interval(()=>{
            if($scope.page == 2) $scope.getLogs();
            },LOGS_DELAY);
        }
    }
    $scope.init();
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