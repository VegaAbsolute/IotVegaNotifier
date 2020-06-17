
var request = require('request');
var http = require('http');
const uuidv4 = require('uuid/v4');
const EventEmitter = require('events');
let moment = require( 'moment' );
class SMSCru extends EventEmitter
{
  constructor(system,status,settings,debugMOD)
  {
    super();
    this._debugMOD = debugMOD;
    this._active = status;
    this._stack = [];
    if(status)
    {
      this._login = system.login;
      this._password = system.password;
      this._settings = settings;
      setInterval(()=>{
        if(this.employment)
        {
          this.checkStack();
        }
      },1000);
    }
  }
  get employment()
  {
    return  this._stack.length>0;
  }
  get active()
  {
    return this._active;
  }
  checkStackEmptiness()
  {
    if(!this.employment) this.emit('free');
  }
  pushVoiceMessage(message,telephone,time)
  {
    let settings={
      call:1,
      voice:this._settings.voice!==undefined?this._settings.voice:'m',
      charset:'utf-8',
      sender:this._settings.sender,
    };
    this._stack.push({message:message,telephone:telephone,settings:settings,uuid:uuidv4(),status:false,firstTime:time});
  }
  checkStack()
  {
    let _self = this;
    for(let i = 0; i < this._stack.length; i++)
    {
      var item = this._stack[i];
      if(!item.status)
      {
        //  console.log('Можно было бы отправить');
        item.status = true;
        let data = {
          login:this._login,
          psw:this._password,
          mes:item.message,
          phones:item.telephone
        };
        if(item.settings!==undefined&&typeof item.settings === 'object' )
        {
          for(var key in item.settings)
          {
            let sett = item.settings[key];
            if(sett!==undefined)
            {
              data[key] = sett;
            }
          }
        }
        this.http_request(data,item.uuid)
          .then((res)=>{
            let bodyRes = res.body;
            let error4 = bodyRes !== undefined && typeof bodyRes === 'string' && bodyRes.indexOf('ERROR = 4') >= -1;
             if(res.status || error4 )
             {

               for(let j = 0 ; j < _self._stack.length; j++)
               {
                 if(_self._stack[j].uuid === res.uuid)
                 {
                  _self._stack.splice(j,1);
                  _self.checkStackEmptiness();
                  if(error4) console.log(moment().format('LLL')+': [SMSC_VOICE] '+'ERROR to send voice message '+_self._stack[j].telephone+' , ip is blocked, http://smsc.ru/faq/99/ ');
                  else console.log(moment().format('LLL')+': [SMSC_VOICE] '+'Success to send voice message '+_self._stack[j].telephone); 
                 }
               }
             }
             else
             {
               for(var j = 0 ; j < _self._stack.length;j++)
               {
                 if(_self._stack[j].uuid === res.uuid)
                 {
                   _self._stack[j].status = false;
                   let tmp = _self._stack[j];
                   _self._stack.splice(j,1);
                   let firstTime = tmp.firstTime;
                   let currentTime = new Date().getTime();
                   let timePassed = firstTime?(currentTime-firstTime):0;
                   let lifeTime = timePassed<86400000;
                   if(lifeTime)
                   {
                     _self.pushVoiceMessage(tmp.message,tmp.telephone,tmp.firstTime);
                   }
                   _self.checkStackEmptiness();
                   console.log(moment().format('LLL')+': [SMSC_VOICE] '+'failed to send  voice message '+tmp.telephone);
                 }
               }

             }
         })
         .catch((e)=>{
          //  item.status = false;
           console.log(moment().format('LLL')+': [SMSC_VOICE] '+'failed to send  http message. Error 1');
           console.log(moment().format('LLL')+': [SMSC_VOICE]',e);
         });
       break;
      }
    }
  }
  http_request(data,uuid)
  {
    let _self = this;
    return new Promise((resolve, reject)=>{
      try
      {
        request.post(
            'http://smsc.ru/sys/send.php',
             {form:data},
             function (error, response, body) {
                if (!error && response.statusCode == 200 && body.indexOf('ERROR =') === -1 )
                {
                    resolve({status:true,uuid:uuid});
                }
                else
                {
                  console.log(moment().format('LLL')+': [SMSC_VOICE]',body);
                  resolve({status:false,uuid:uuid,body:body});
                }
            }
        );
      }
      catch (e)
      {
        reject(e);
      }
    });
  }
}
module.exports = SMSCru;
