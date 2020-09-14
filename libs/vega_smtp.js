//vega_smtp.js version 2.0.0 lite
const uuidv4 = require('uuid/v4');
const EventEmitter = require('events');
const nodemailer = require('nodemailer');
let moment = require( 'moment' );
const logger = require('./vega_logger.js');
class VegaSMTP extends EventEmitter
{
  constructor(status,host,port,secure,user,password,debugMOD)
  {
    super();
    this._debugMOD = debugMOD;
    this._active = status;
    this._stack = [];
    if(status)
    {
      this._host = host;
      this._port = port;
      this._secure = secure;
      this._user = user;
      this._password = password;
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
  reload()
  {
    let host = this._host;
    let port = this._port;
    let secure = this._secure;
    let user = this._user;
    let pass = this._password;
    this._connect = nodemailer.createTransport({
        host: host,
        port: port,
        secure: secure,
        auth: {
            user: user,
            pass: pass
        }
    });
    this._connect._self = this;
    setTimeout(()=>{
        let self = this;
        this._connect.verify((err)=>{
            if (err) 
            {
              logger.log({
                level:'error',
                message:'Error connect SMTP. ERROR 113',
                module:'[SMTP]',
                time:moment().format('LLL'),
                timestamp:parseInt(moment().format('x')),
                uuid:uuidv4()
              });
              console.log(moment().format('LLL')+': '+'[SMTP] Error ',err);
              this._connect._status = false;  
              this._connect._timeLastUpdate = new Date().getTime();
            }
            else
            {
                self._connect._status = true;
                self._connect._timeLastUpdate = new Date().getTime();
                logger.log({
                  level:'info',
                  message:'Successfully started SMTP',
                  module:'[SMTP]',
                  time:moment().format('LLL'),
                  timestamp:parseInt(moment().format('x')),
                  uuid:uuidv4()
                });
                console.log(moment().format('LLL')+': '+'[SMTP] Successfully started SMTP');
                self.emit('SMTPStarted');
            }
        });
    },100);
  }
  checkStackEmptiness()
  {
    if(!this.employment) this.emit('free');
  }
  pushMessage(message,email,time)
  {
    this._stack.push({message:message,email:email,uuid:uuidv4(),status:false,firstTime:time});
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
                email:item.email,
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
                                message:'Success to send message '+_self._stack[j].email,
                                module:'[SMTP]',
                                time:moment().format('LLL'),
                                timestamp:parseInt(moment().format('x')),
                                uuid:uuidv4()
                              });
                              console.log(moment().format('LLL')+': '+'[SMTP] Success to send message '+_self._stack[j].email);
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
                                    _self.pushMessage(tmp.message,tmp.email,tmp.firstTime);
                                }
                                logger.log({
                                  level:'warn',
                                  message:'Failed to send message '+tmp.email,
                                  module:'[SMTP]',
                                  time:moment().format('LLL'),
                                  timestamp:parseInt(moment().format('x')),
                                  uuid:uuidv4()
                                });
                                console.log(moment().format('LLL')+': '+'[SMTP] Failed to send message '+tmp.email, res.err);
                                _self.checkStackEmptiness();
                            }
                        }
                    }
                })
                .catch((e)=>{
                    logger.log({
                      level:'error',
                      message:'Failed to send message. Error 1',
                      module:'[SMTP]',
                      time:moment().format('LLL'),
                      timestamp:parseInt(moment().format('x')),
                      uuid:uuidv4()
                    });
                    console.log(moment().format('LLL')+': '+'[SMTP] Failed to send message. Error 1');
                    console.log(moment().format('LLL')+': [SMTP]',e);
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
        _self._connect.sendMail({
            from: '"IotVegaNotifier " <'+_self._user+'>', 
            to: data.email, 
            subject: 'IotVegaNotifier danger', // Subject line
            text: data.mes
        })
        .then((res)=>{
            resolve({status:true,uuid:uuid});
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
module.exports = VegaSMTP;
