//vega_smpp.js version 2.0.0 lite
const SMPP = require('smpp');
const uuidv4 = require('uuid/v4');
const EventEmitter = require('events');
let moment = require( 'moment' );
const logger = require('./vega_logger.js');
const smsHelper = require('smshelper');
class VegaSMPP extends EventEmitter
{
  constructor(address,system,info,status,debugMOD)
  {
    super();
    this._debugMOD = debugMOD;
    this._active = status;
    this._stack = [];
    if(status)
    {
      this._address = address;
      this._system = system;
      this._info = {};
      this._connect = {
        _status:false
      };
      if(info)
      {
        this._info = info;
      }
      this.reload();
      setInterval(()=>{
        if(this._connect._status)
        {
        }
        else
        {
          var currentDate = new Date().getTime();
          var validLastTimeReconnect = this._connect._last_time_reconnect!==undefined&&typeof this._connect._last_time_reconnect==='number';
          var lastDate = validLastTimeReconnect?this._connect._last_time_reconnect:currentDate;
          var time = currentDate-lastDate;
          if(time>20000&&!this._connect._status)
          {
            this.reload();
          }
          else
          {

          }
        }
      }, 5000);
      setInterval(()=>{
        if(this.employment)
        {
          this.checkStackSMS();
        }
        if(this._connect._status)
        {
          if(this._connect._counter===undefined)
          {
            this._connect._counter=0;
          }
          else
          {
            this._connect._counter+=100;
          }
          if(this._connect._counter>=30000)
          {
            this._connect._counter=0;
            this._connect.enquire_link();
          }
        }
      },100);
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
  pushSMS(message,telephone,time)
  {
    if(smsHelper.parts(message) > 1)
    {
      while(message.length>0)
      {
        var currentMess = message.substr(0,70);
        message = message.slice(70);
        this._stack.push({message:currentMess,telephone:telephone,uuid:uuidv4(),status:false,firstTime:time});
      }
    }
    else
    {
      this._stack.push({message:message,telephone:telephone,uuid:uuidv4(),status:false,firstTime:time});
    }
  }
  checkStackSMS()
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
          this.sendSMS(item.telephone,item.message,item.uuid)
          .then((res)=>{
           if(res.status)
           {

             for(let j = 0 ; j < _self._stack.length; j++)
             {
               if(_self._stack[j].uuid === res.uuid)
               {
                 console.log(moment().format('LLL')+': [SMPP] '+'Success to send sms message '+_self._stack[j].telephone);
                 logger.log({
                    level:'info',
                    message:'Success to send sms message '+_self._stack[j].telephone,
                    module:'[SMPP]',
                    time:moment().format('LLL'),
                    timestamp:parseInt(moment().format('x')),
                    uuid:uuidv4()
                  });
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
                   _self.pushSMS(tmp.message,tmp.telephone,tmp.firstTime);
                 }
                 _self.checkStackEmptiness();
                 console.log(moment().format('LLL')+':  [SMPP] '+'failed to send  sms message '+tmp.telephone);
                 logger.log({
                    level:'warn',
                    message:'Failed to send  sms message '+tmp.telephone,
                    module:'[SMPP]',
                    time:moment().format('LLL'),
                    timestamp:parseInt(moment().format('x')),
                    uuid:uuidv4()
                  });
               }
             }

           }
         })
         .catch((e)=>{
           item.status = false;
           logger.log({
              level:'error',
              message:'Failed to send  sms message. Error 1',
              module:'[SMPP]',
              time:moment().format('LLL'),
              timestamp:parseInt(moment().format('x')),
              uuid:uuidv4()
            });
           console.log(moment().format('LLL')+':  [SMPP] '+'failed to send  sms message. Error 1');
           console.log(moment().format('LLL')+':  [SMPP]',e);
         });
         break;
        }
      }
    }
  }
  checkStackEmptiness()
  {
    if(!this.employment) this.emit('free');
  }
  reload()
  {
    console.log('RELOAD SMPP');
    if(!this._address) return;
    this._connect = new SMPP.Session(this._address);
    this._connect._system = this._system;
    this._connect._last_time_reconnect = new Date().getTime();
    this._connect.on('close',this._close);
    this._connect.on('error',this._error);
    this._connect.on('pdu',this._pdu);
    this._connect.on('connect',this._connectSMPP);
    this._connect._self = this;
  }
  _connectSMPP()
  {
    var _self = this;
    this.bind_transceiver(this._system, function(pdu) {
      if (pdu.command_status == 0)
      {
          _self._status = true;
          _self._self.emit('SMPPStarted');
          console.log(moment().format('LLL')+': [SMPP] '+'Successful connection on SMPP ');
          logger.log({
            level:'info',
            message:'Successful connection on SMPP ',
            module:'[SMPP]',
            time:moment().format('LLL'),
            timestamp:parseInt(moment().format('x')),
            uuid:uuidv4()
          });
      }
      else if(pdu.command_status == 5) {
        _self._status = false;
        _self.unbind();
        console.log(moment().format('LLL')+':  [SMPP] '+'Not successful connection on SMPP, status = 5');
        logger.log({
          level:'warn',
          message:'Not successful connection on SMPP, status = 5',
          module:'[SMPP]',
          time:moment().format('LLL'),
          timestamp:parseInt(moment().format('x')),
          uuid:uuidv4()
        });
      }
      else
      {
        _self._status = false;
        logger.log({
          level:'warn',
          message:'Not successful connection on SMPP, status ='+pdu.command_status,
          module:'[SMPP]',
          time:moment().format('LLL'),
          timestamp:parseInt(moment().format('x')),
          uuid:uuidv4()
        });
        console.log(moment().format('LLL')+':  [SMPP] '+'Not successful connection on SMPP, status ='+pdu.command_status);
      }
    });
    this._self.checkStackSMS();
  }
  _pdu(pdu)
  {
    if (pdu.command == 'deliver_sm')
    {
      try
      {
        var fromNumber = pdu.source_addr.toString();
        var toNumber = pdu.destination_addr.toString();
        var text = '';
        if (pdu.short_message && pdu.short_message.message)
        {
          text = pdu.short_message.message;
        }
        logger.log({
          level:'info',
          message:'SMS ' + fromNumber + ' -> ' + toNumber + ': ' + text,
          module:'[SMPP]',
          time:moment().format('LLL'),
          timestamp:parseInt(moment().format('x')),
          uuid:uuidv4()
        });
        console.log(moment().format('LLL')+':  [SMPP] '+'SMS ' + fromNumber + ' -> ' + toNumber + ': ' + text);
        // Reply to SMSC that we received and processed the SMS
        this.deliver_sm_resp({ sequence_number: pdu.sequence_number });
      }
      catch(err)
      {
        logger.log({
          level:'error',
          message:'Error event pdu deliver_sm',
          module:'[SMPP]',
          time:moment().format('LLL'),
          timestamp:parseInt(moment().format('x')),
          uuid:uuidv4()
        });
        console.log(moment().format('LLL')+':  [SMPP] '+'Error event pdu deliver_sm, ',err);
        console.dir(moment().format('LLL')+':  [SMPP] '+'pdu',pdu);
      }
    }
  }
  _close()
  {
    logger.log({
      level:'warn',
      message:'Status smpp disconnected',
      module:'[SMPP]',
      time:moment().format('LLL'),
      timestamp:parseInt(moment().format('x')),
      uuid:uuidv4()
    });
    console.log(moment().format('LLL')+':  [SMPP] '+'smpp disconnected');
    this._status = false;
  }
  _error(error)
  {
    logger.log({
      level:'error',
      message:'smpp error 555',
      module:'[SMPP]',
      time:moment().format('LLL'),
      timestamp:parseInt(moment().format('x')),
      uuid:uuidv4()
    });
    console.log(moment().format('LLL')+':  [SMPP] '+'smpp error', error);
    this._status = false;
  }
  lookupPDUStatusKey(status)
  {
    try {
      for (var k in SMPP.errors)
      {
        if (SMPP.errors[k] == pduCommandStatus) return k;
      }
    } catch (e) {
      return undefined;
    } finally {

    }

  }
  sendSMS(to, text, uuid)
  {
    let _self = this;
    return new Promise((resolve, reject)=>{
      try
      {
        to   = to.toString();
        let mess = {
            destination_addr: to,
            short_message: text
        };
        for(let key in _self._info)
        {
          mess[key] = _self._info[key];
        }
        _self._connect.submit_sm(mess, function(pdu)
        {
            if (pdu.command_status == 0)
            {
                resolve({status:true,uuid:uuid});
            }
            else
            {
              logger.log({
                level:'warn',
                message:'PDU status smpp '+pdu.command_status,
                module:'[SMPP]',
                time:moment().format('LLL'),
                timestamp:parseInt(moment().format('x')),
                uuid:uuidv4()
              });
              console.log(moment().format('LLL')+':  [SMPP]'+pdu.command_status);
              resolve({status:false,uuid:uuid});
            }
        });
      }
      catch (e)
      {
        reject(e);
      }
    });
  }
}
module.exports = VegaSMPP;
