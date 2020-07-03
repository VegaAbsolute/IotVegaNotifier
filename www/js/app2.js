class Settings
{
    constructor()
    {
        this.administrator={};
        this.system={};
        this.smpp={};
        this.smsc={};
        this.smtp={};
        this.telegram={};
        this.ws={};
        this.http={};
    }
    clear()
    {
        this.administrator={};
        this.system={};
        this.smpp={};
        this.smsc={};
        this.smtp={};
        this.telegram={
            proxy:{status:false}
        };
        this.ws={};
        this.http={};
    }
    set_data_settings(conf)
    {
        this.clear();
        this.administrator.status = conf._administrator.status;
        this.system.debug = conf._debugMOD.status;
        this.system.auto_update = conf._system.auto_update;
        this.system.between_time_sms = conf._devices.betweenTimeSMS;
        this.telegram.status = conf._telegram.status;
        this.smpp.status = conf._smpp.status;
        this.smsc.status = conf._smsc.status;
        this.copyObject(conf._administrator.settings,'administrator');
        this.copyObject(conf._smpp.address,'smpp');
        this.copyObject(conf._smpp.info,'smpp');
        this.copyObject(conf._smpp.system,'smpp');
        this.copyObject(conf._smsc.settings,'smsc');
        this.copyObject(conf._smsc.system,'smsc');
        this.copyObject(conf._smtp,'smtp');
        this.copyObject(conf._telegram,'telegram');
        this.copyObject(conf._ws,'ws');
    }
    // convertWebToAppSettings(config)
    // {
    //     let resultConfig = {
    //         _administrator:{},
    //         _debugMOD:{},
    //         _devices:{},
    //         _sip:{},
    //         _smpp:{},
    //         _smsc:{},
    //         _smtp:{},
    //         _system:{},
    //         _telegram:{},
    //         _ws:{}
    //     }
    //     resultConfig._administrator.status = config.administrator.status;
    //     resultConfig._administrator.settings = {
    //         gateway_active: config.administrator.gateway_active,
    //         gateway_inactive: config.administrator.gateway_inactive,
    //         phone: config.administrator.phone,
    //         server_not_available: config.administrator.server_not_available,
    //         test_startup_message: config.administrator.test_startup_message
    //     };
    //     resultConfig._debugMOD.status = config.system.debug;
    //     resultConfig._devices.betweenTimeSMS = config.system.between_time_sms;
    //     resultConfig._sip.status = config.administrator.status;
    //     resultConfig._sip.settings = {
    //         gateway_active: config.administrator.gateway_active,
    //         gateway_inactive: config.administrator.gateway_inactive,
    //         phone: config.administrator.phone,
    //         server_not_available: config.administrator.server_not_available,
    //         test_startup_message: config.administrator.test_startup_message
    //     };
    // }
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
app.controller('AppController',function($scope,$timeout,$http){
    $scope.page = 1;
    $scope.page_settings = 1;
    $scope.settings = new Settings();
    $scope.edit_settings = {};
    $scope.refresh_settings = function(conf)
    {
        this.settings.set_data_settings(conf);
        this.edit_settings = this.settings.clone();
    }
    $scope.getSettings = function()
    {
        $http.get('/currentSettings')
        .then((res)=>{
            if(res.data && typeof res.data === 'object' && res.data.status)
            {
                $scope.refresh_settings(res.data.data);
            }
            else
            {
                alert('Error 1.');
            }
        });
    }
    $scope.selectGroupSettings = function(page_settings)
    {
        this.page_settings = page_settings;
    }
    $scope.getSettings();
});