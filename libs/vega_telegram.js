
//vega_telegram.js version 2.0.0 lite
process.env.NTBA_FIX_319 = 1;
const uuidv4 = require('uuid/v4');
const EventEmitter = require('events');
const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');
const logger = require('./vega_logger.js');
let moment = require( 'moment' );
let linkBot = undefined;
class VegaTelegram extends EventEmitter
{
  constructor(token,status,proxy,debugMOD)
  {
    super();
    this._debugMOD = debugMOD;
    this._active = status;
    this._stack = [];
    if(status)
    {
      this._token = token;
      this._proxy = proxy;
      this._connect = {
          _status:false,
          _timeLastUpdate:new Date().getTime()
      };
      this.reload();
      setInterval(()=>{
        let currentTime = new Date().getTime();
        let firstTime = this._connect._timeLastUpdate;
        let timePassed = firstTime?(currentTime-firstTime):0;
        if(!this._connect._status&&timePassed>30000)
        {
          this.reload();
        }
      },30000);      
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
  validProxy()
  {
    return this._proxy.host && this._proxy.port && this._proxy.status === true;
  }
  reload()
  {
    linkBot = undefined;
    let polling = {polling:true};
    if ( this.validProxy() )
    {
        let host = this._proxy.host;
        let port = this._proxy.port;
        let username = this._proxy.login;
        let password = this._proxy.password;
        polling.request = {
        agentClass: Agent,
        agentOptions: {
                socksHost: host,
                socksPort: port
            }
        }
        if( username && password ) 
        {
            polling.request.agentOptions.socksUsername = username;
            polling.request.agentOptions.socksPassword = password;
        }
    } 
    this._connect = new TelegramBot(this._token, polling);
    this._connect._uuidConnect = uuidv4();
    this._connect._status = true;
    this._connect._timeLastUpdate = new Date().getTime();
    this._connect.on('polling_error',this._error);
    this._connect.onText(/\/chatid/,this._getChatID);
    this._connect._self = this;
    linkBot = this._connect;
    setTimeout(()=>{
      if( this._connect._status === true )
      {
        this._connect.getMe()
        .then((info)=>{
          logger.log({
            level:'info',
            message:'Successfully started telegram bot management '+ info.username,
            module:'[TELEGRAM]',
            time:moment().format('LLL'),
            timestamp:parseInt(moment().format('x')),
            uuid:uuidv4()
          });
          console.log(moment().format('LLL')+': '+'[Telegram] Successfully started telegram bot management '+ info.username);
        })
        .catch(this._error);
        this.emit('telegramStarted');
      }
    },400);
  }
  _getChatID(msg)
  {
    var chatId = msg.chat.id;
    if( linkBot !== undefined && typeof linkBot === 'object' && linkBot._status === true )
    {
      linkBot.sendMessage(chatId, "ChatID: "+chatId.toString());
    }
    logger.log({
      level:'info',
      message:'ChatID: '+ chatId.toString(),
      module:'[TELEGRAM]',
      time:moment().format('LLL'),
      timestamp:parseInt(moment().format('x')),
      uuid:uuidv4()
    });
    console.log(moment().format('LLL')+': '+'[Telegram] ChatID: '+ chatId.toString());
  }
  _error(err)
  {
    //вывод информации об ошибке
    logger.log({
      level:'error',
      message:'Error '+err.code+' . '+err.message,
      module:'[TELEGRAM]',
      time:moment().format('LLL'),
      timestamp:parseInt(moment().format('x')),
      uuid:uuidv4()
    });
    console.log(moment().format('LLL')+': '+'[Telegram] Error '+err.code+' . '+err.message);
    //Проверяем относится ли ошибка к текущему соединению
    var oldConnect = this._uuidConnect !== linkBot._uuidConnect;
    //Если сообщение с кодом ETELEGRAM и оно не для старого коннекта
    //то это соединение прерывать не стоит
    if(typeof err === 'object' && err.code === 'ETELEGRAM' && !oldConnect)  return;
    //Остановим pilling
    this.stopPolling().then(()=>{
      logger.log({
        level:'warn',
        message:'Unavailable telegram',
        module:'[TELEGRAM]',
        time:moment().format('LLL'),
        timestamp:parseInt(moment().format('x')),
        uuid:uuidv4()
      });
      console.log(moment().format('LLL')+': '+'[Telegram] Unavailable telegram');
    });
    //Если старый коннект, то больше ничего делать не стоит
    if(oldConnect) return;
    
    this._status = false;  
    this._timeLastUpdate = new Date().getTime();
    linkBot = undefined;
  }
  checkStackEmptiness()
  {
    if(!this.employment) this.emit('free');
  }
  pushMessage(message,chatId,time)
  {
    this._stack.push({message:message,chatId:chatId,uuid:uuidv4(),status:false,firstTime:time});
  }
  checkStack()
  {
    let _self = this;
    if(this._connect._status)
    {
        for(let i = 0; i < this._stack.length; i++)
        {
            var item = this._stack[i];
            if(!item.status)
            {
                item.status = true;
                let data = {
                chatId:item.chatId,
                mes:item.message
                };
                _self.sendMessage(data,item.uuid)
                .then((res)=>{
                    if(res.status)
                    {
                        for(let j = 0 ; j < _self._stack.length; j++)
                        {
                            if(_self._stack[j].uuid === res.uuid)
                            {
                              logger.log({
                                level:'info',
                                message:'Success to send message '+_self._stack[j].chatId+'( '+res.username+' )',
                                module:'[TELEGRAM]',
                                time:moment().format('LLL'),
                                timestamp:parseInt(moment().format('x')),
                                uuid:uuidv4()
                              });
                              console.log(moment().format('LLL')+': '+'[Telegram] Success to send message '+_self._stack[j].chatId+'( '+res.username+' )');
                              _self._stack.splice(j,1);
                              _self.checkStackEmptiness();
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
                                    _self.pushMessage(tmp.message,tmp.chatId,tmp.firstTime);
                                }
                                logger.log({
                                  level:'warn',
                                  message:'Failed to send message '+tmp.chatId+'. Error '+ res.err.code+'. '+res.err.message,
                                  module:'[TELEGRAM]',
                                  time:moment().format('LLL'),
                                  timestamp:parseInt(moment().format('x')),
                                  uuid:uuidv4()
                                });
                                console.log(moment().format('LLL')+': '+'[Telegram] Failed to send message '+tmp.chatId+'. Error '+ res.err.code+'. '+res.err.message);
                                _self.checkStackEmptiness();
                            }
                        }
                    }
                })
                .catch((e)=>{
                  logger.log({
                    level:'error',
                    message:'Failed to send message. Error 1',
                    module:'[TELEGRAM]',
                    time:moment().format('LLL'),
                    timestamp:parseInt(moment().format('x')),
                    uuid:uuidv4()
                  });
                  console.log(moment().format('LLL')+': '+'[Telegram] Failed to send message. Error 1');
                  console.log(moment().format('LLL')+': [Telegram]',e);
                });
                break;
            }
        }
    }
  } 
  sendMessage(data,uuid)
  {
    let _self = this;
    return new Promise((resolve, reject)=>{
      try
      {
        _self._connect.sendMessage(data.chatId, data.mes)
        .then((res)=>{
          resolve({status:true,uuid:uuid,username:res.chat.username!==undefined?res.chat.username:res.chat.title});
        })
        .catch((err)=>{
            _self._connect._status = false;
            _self._connect._timeLastUpdate = new Date().getTime();
            resolve({status:false,uuid:uuid,err:err});
        });
      }
      catch (e)
      {
        reject(e);
      }
    });
  }
}
module.exports = VegaTelegram;
