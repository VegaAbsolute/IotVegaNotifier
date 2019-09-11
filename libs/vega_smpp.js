//vega_smpp.js version 1.0.0
const SMPP = require('smpp');
const uuidv4 = require('uuid/v4');
const EventEmitter = require('events');
let moment = require( 'moment' );
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
        //  console.log(this._connect._status);
        }
        else
        {
        //  console.log(this._connect._status);
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
    this._stack.push({message:message,telephone:telephone,uuid:uuidv4(),status:false,firstTime:time});
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
                 console.log(moment().format('LLL')+': '+'Success to send sms message '+_self._stack[j].telephone);
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
                 {
                   _self.pushSMS(tmp.message,tmp.telephone,tmp.firstTime);
                 }
                 _self.checkStackEmptiness();
                 console.log(moment().format('LLL')+': '+'failed to send  sms message '+tmp.telephone);
               }
             }

           }
         })
         .catch((e)=>{
           item.status = false;
           console.log(moment().format('LLL')+': '+'failed to send  sms message. Error 1');
           console.log(moment().format('LLL')+': ',e);
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
          console.log(moment().format('LLL')+': '+'Successful connection on SMPP ');
      }
      else if(pdu.command_status == 5) {
        _self._status = false;
        _self.unbind();
        console.log(moment().format('LLL')+': '+'Not successful connection on SMPP, status = 5');
      }
      else
      {
        _self._status = false;
        console.log('Not successful connection on SMPP, status ='+pdu.command_status);
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
        console.log(moment().format('LLL')+': '+'SMS ' + fromNumber + ' -> ' + toNumber + ': ' + text);
        // Reply to SMSC that we received and processed the SMS
        this.deliver_sm_resp({ sequence_number: pdu.sequence_number });
      }
      catch(err)
      {
        console.log(moment().format('LLL')+': '+'Error event pdu deliver_sm, ',err);
        console.dir(moment().format('LLL')+': '+'pdu',pdu);
      }
    }
  }
  _close()
  {
    console.log(moment().format('LLL')+': '+'smpp disconnected');
    this._status = false;
  }
  _error(error)
  {
    console.log(moment().format('LLL')+': '+'smpp error', error);
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
          //  source_addr: _self._info.sender,
            destination_addr: to,
            short_message: text,
            //source_addr_ton: _self._info.source_addr_ton
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
              console.log(moment().format('LLL')+': '+pdu.command_status);
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
