const { exec } = require('child_process');
const uuidv4 = require('uuid/v4');
const RHvoice = require('./vega_rhvoice.js');
const fs = require('fs');
const CronJob = require('cron').CronJob;
class VegaLinphone extends RHvoice
{
  constructor(host,name,password,otherSettings,cronCmd,rhvoiceSettings,active,debugMOD)
  {
    super(rhvoiceSettings,debugMOD);
    this._otherSettings = otherSettings;
    this._host = host;
    this._user_name = name;
    this._user_password = password;
    this._active = active;
    this._status = false;
    this._debugMOD = debugMOD;
    this.clearTrash();
    this._stack = {
      active:undefined
    };
  //  this.reload();
    var _self = this;
    if(cronCmd!==undefined)
    {
      this.clearJob = new CronJob({
        cronTime: cronCmd,
        onTick: function() {
          _self.clearTrash();
        },
        start: true,
      });
    }
    if(this._active)
    {
      setInterval(()=>{
        if(this.last_time_response_linphone===undefined) this.last_time_response_linphone = new Date().getTime();
        let _activeCall = this.activeCall;
        let currentDate = new Date().getTime();
        let validLastTimeReconnect = this.last_time_reconnect!==undefined;
        let lastDateReconnect = validLastTimeReconnect?this.last_time_reconnect:currentDate;
        let timeReconnect = currentDate-lastDateReconnect;
        let validLastTimeCheckRegistration = this.last_time_checkStatusRegistration!==undefined;
        let lastDateCheckRegistration = validLastTimeCheckRegistration?this.last_time_checkStatusRegistration:currentDate;
        let timeCheckRegistration = currentDate-lastDateCheckRegistration;
        let timeCheckTimeResponse = currentDate-this.last_time_response_linphone;
        if(timeCheckTimeResponse>30000)
        {
          console.error('SIP: Hang, Force reload');
          this.reload();
        }
        if(timeCheckRegistration==0||timeCheckRegistration>10000)
        {
          this.checkStatusRegistration();
        }
        if(!this._status)
        {
          //Не чего не происходит ( раньше происходило=) )
        }
        else if(_activeCall!==false&&typeof _activeCall === 'object')
        {
          this.calls();
        }
        else if(this.employment)
        {
          this.checkStack();
        }
      },2000);
    }
  }
  get employment()
  {
    return  Object.keys(this._stack).length>1;
  }
  get activeCall()
  {
    let activeUuid = this._stack.active;
    let activeItem = activeUuid!==undefined&&activeUuid&&this._stack[activeUuid];
    let _activeCall = activeItem!==undefined;
    return _activeCall?activeItem:false;
  }
  checkStackEmptiness()
  {
    if(!this.employment) this.emit('free');
  }
  clearTrash()
  {
    var tmpFileList = {};
    var _self = this;
    fs.readdir(this._directory, function(err, items) {
        try
        {
          if(items&&typeof items === 'object' &&items.length<=0) return;
          for (var i=0; i<items.length; i++)
          {
            let nameFile = items[i];
            if(nameFile==_self._startupSound) continue;
            if(nameFile&&typeof nameFile == 'string')
            {
              let hash = nameFile.replace('.wav','');
              if(tmpFileList[hash]===undefined) tmpFileList[hash] = {};
              tmpFileList[hash].file = true;
              tmpFileList[hash].nameFile = nameFile;
            }
          }
          for (let hash in _self.wavList)
          {
            if(tmpFileList[hash]===undefined) tmpFileList[hash] = {};
            tmpFileList[hash].wavList = true;
          }
          for (let uuid in _self._stack)
          {
            if(_self._stack[uuid])
            {
                if(tmpFileList[_self._stack[uuid].hash]===undefined) tmpFileList[_self._stack[uuid].hash] = {};
                tmpFileList[_self._stack[uuid].hash].stack = true;
            }
          }
          for(let hash in tmpFileList)
          {
            let item = tmpFileList[hash];
            let validFile = (item.file&&item.nameFile)?true:false;
            if(item.stack) continue;
            if(item.wavList)
            {
              delete _self.wavList[hash];
            }
            if(validFile)
            {
              let filePath = _self._directory+'/'+item.nameFile;
              if(_self._debugMOD) console.log('SIP: Delete file '+filePath);
              fs.unlinkSync(filePath);
            }
          }
        }
        catch (e)
        {
          console.error('SIP: error clearTrash',e);
        }
    });
  }
  reload()
  {
    if(this._debugMOD) console.log('SIP: Reload linphone');
    let _self = this;
    this._status = false;
    this.init()
    .then((res)=>{
      if(res)
      {
      }
    })
    .catch((e)=>{
      console.error('SIP: Error initialization linphone',e);
    });
  }
  init()
  {
    var _self = this;
    return new Promise((resolve, reject)=>{
      try
      {
        exec('"pkill" -9 linphone*', (err, stdout, stderr) => {
          exec('"linphonecsh" init', (err, stdout, stderr) => {
            _self.last_time_response_linphone = new Date().getTime();
            if(_self._debugMOD) console.log('SIP: Initialization linphone',stdout);
            resolve(true);
          });
        });
      }
      catch (e)
      {
        reject(e);
      }
    });
  }
  useFilesSoundcart()
  {
    var _self = this;
    return new Promise((resolve, reject)=>{
      try
      {
        exec('"linphonecsh" soundcard use files', (err, stdout, stderr) => {
          _self.last_time_response_linphone = new Date().getTime();
          if(_self._debugMOD) console.log('SIP: Soundcard use files',stdout);
          resolve(true);
        });
      }
      catch (e)
      {
        reject(e);
      }
    });
  }
  updateStatusCalls(knownCalls)
  {
    for(let key in knownCalls)
    {
      let itemCall = knownCalls[key];
      let _activeCall = this.activeCall;
      if(_activeCall&&_activeCall.id == itemCall.id)
      {
        if(_activeCall.type=='voicemessage')
        {
          if(_activeCall.telephone==itemCall.telephone)
          {
            _activeCall.state = itemCall.state;
            let currentTime = new Date().getTime();
            let lastPlayTime = _activeCall.lastPlay?_activeCall.lastPlay:0;
            let timePassed = currentTime-lastPlayTime;
            if(_activeCall.countPlay===undefined) _activeCall.countPlay = 0;
            let wav = this.wavList[_activeCall.hash];
            let durationWav = typeof wav === 'object'&&wav.status&&wav.info.duration?wav.info.duration*1000:30000;
            let checkNewPlay = timePassed>durationWav;
            if(_activeCall.state=='StreamsRunning'&&checkNewPlay&&_activeCall.countPlay<2)
            {
              if(_activeCall.taking)
              {
                if(this._debugMOD) console.log('SIP: Success call '+_activeCall.telephone);
                _activeCall.countPlay++;
                _activeCall.lastPlay = currentTime;
                let dir = wav.directory;
                if(dir!==undefined) this.play(dir,durationWav);
              }
              _activeCall.taking = true;
            }
            else if(_activeCall.countPlay>=2&&checkNewPlay)
            {
              if(this._debugMOD) console.log('SIP: Ended call '+_activeCall.telephone);
              this.stopCall();
            }
            return;
          }
        }
        else if(_activeCall.type=='dialup')
        {
          console.log('SIP: NLO');
          return;
        }
      }
    }
    this.stopCall();
  }

  calls()
  {
    try
    {
      exec('"linphonecsh" generic calls', (err, stdout, stderr) => {
        this.last_time_response_linphone = new Date().getTime();
        let callsList = {};
        if(stdout)
        {
          let arrTMP = stdout.split('------------------------------------------------------------------------');
          if(arrTMP.length>1)
          {
            for(let i = 1 ; i<arrTMP.length; i++)
            {
              let item = arrTMP[i];
              if (!item) continue;
              item = item.split('|');
              if (!item[0]||!item[1]) continue;
              let id = parseInt(item[0]);
              if (isNaN(id)) continue;
              let phone = item[1].replace(/<sip:(.+?)@.+/,'$1');
              phone = phone.replace(/\s+/g,'');
              if (!phone) continue;
              callsList[id] = {
                id:id,
                telephone:phone,
                state:item[2].replace(/\s+/g,''),
                info:item[3].replace(/\s+/g,'')
              };
            }
          }
          else
          {
            this.activeCall.state = 'StreamsNo';
            console.log('SIP: No active calls');
          }
        }
        this.updateStatusCalls(callsList)
      });
    }
    catch (e)
    {
      console.error('SIP: Fatal error calls',e)
    }
  }
  play(file)
  {
    try
    {
      let _self = this;
      exec(`"linphonecsh" generic 'play ${file}'`, (err, stdout, stderr) => {
        _self.last_time_response_linphone = new Date().getTime();
        if(_self._debugMOD) console.log('LINPHONE: play '+file);
      });
    }
    catch (e)
    {
      console.error('SIP: ',e);
    }
  }
  stopCall()
  {
    this._stack.active = undefined;
    for (var key in this._stack)
    {
      if (key === 'active') continue;
      if (this._stack[key].taking)
      {
        this.terminate(this._stack[key].id);
        delete this._stack[key];
        this.checkStackEmptiness();
      }
    }
  }
  terminate(id)
  {
    let _self = this;
    exec(`"linphonecsh" generic 'terminate ${id}'`, (err, stdout, stderr) => {
      _self.last_time_response_linphone = new Date().getTime();
      if(_self._debugMOD) console.log('SIP: Terminate '+id);
    });
  }
  checkStatusRegistration()
  {
    let _self = this;
    this.last_time_checkStatusRegistration = new Date().getTime();
    exec('"linphonecsh" status register', (err, stdout, stderr) => {
      _self.last_time_response_linphone = new Date().getTime();
      if(stdout)
      {
        let sipAcc = this._user_name+'@'+this._host;
        if(stdout.indexOf('registered=0')>-1)
        {
          if(_self._debugMOD) console.log('SIP: No registration');
          _self._status = false;
          _self.registration();
        }
        else if(stdout.indexOf('registered')>-1&&stdout.indexOf(sipAcc)>-1)
        {
          if(_self._status === false)
          {
            if(_self._debugMOD) console.log('SIP: Good registration');
            _self.useFilesSoundcart()
            .then((res)=>{
            //  if(_self._debugMOD) console.log('SIP: Success useFilesSoundcart');
            })
            .catch((e)=>{
              console.error('SIP: Error useFilesSoundcart',e);
            });
          }
          //if(_self._debugMOD) console.log('SIP: Good registration');
          _self._status = true;
        }
        else
        {
          //stdout.indexOf('registered=-1')
          if(_self._debugMOD) console.log('SIP: Bad registration');
          _self._status = false;
          _self.reload();
        }
      }
      else
      {
        _self._status = false;
        _self.reload();
      }
      return;
    });
  }
  registration()
  {
    let _self = this;
    if(_self._debugMOD) console.log('SIP: Progress registration');
    exec('"linphonecsh" register --host '+this._host+' --username '+this._user_name+' --password '+this._user_password, (err, stdout, stderr) => {
      this.last_time_response_linphone = new Date().getTime();
      this.last_time_reconnect = new Date().getTime();
    });
  }
  get active()
  {
    return this._active;
  }
  pushDialUp(message,telephones,UUID,other)
  {
    console.log('SIP: MAMONT');
  }
  pushVoiceMessage(message,telephone,time)
  {
    if(this._debugMOD) console.log('SIP: Push voice message '+telephone);
    let uuid = uuidv4();
    let hash = this.md5(message);
    this._stack[uuid] = {
      message:message,
      telephone:telephone,
      uuid:uuid,
      hash:hash,
      firstTime:time,
      type:'voicemessage'
    };
  }
  checkStack()
  {
    let _self = this;
    for(let i in this._stack)
    {
      if(i==='active') continue;
      let item = this._stack[i];
      if (item.state)
      {
        this.refreshMessage(item.uuid,item.state);
        continue;
      }
      if(typeof item.message !== 'string') continue;
      this.textToSpeech(item.message)
      .then((res)=>{
         if(res.status)
         {
          this.call(item)
         }
      })
      .catch((e)=>{
        console.error('SIP: ',e);
      });
      break;
    }
  }
  refreshMessage(uuid)
  {
    let tmp = this._stack[uuid];
    let mess = tmp.message;
    let tel = tmp.telephone;
    let type = tmp.type;
    let hash = tmp.hash;
    let firstTime = tmp.firstTime;
    let currentTime = new Date().getTime();
    let timePassed = firstTime?(currentTime-firstTime):0;
    let lifeTime = timePassed<86400000;
    delete this._stack[uuid];
    if(type == 'voicemessage' && lifeTime)
    {
      this.pushVoiceMessage(mess,tel,firstTime);
    }
    this.checkStackEmptiness();
  }
  call(item)
  {
    var _self = this;
    if(item.type=='voicemessage')
    {
      this.dial(item.telephone,item.message,item.uuid)
      .then((res)=>{
        if(res.status)
        {
          this.play(`${this._directory}/${_self._startupSound}`);
          if(_self._stack[res.uuid])
          {
           _self._stack.active = res.uuid;
           item.state = undefined;
           item.id = res.id;
           if(_self._debugMOD) console.log('SIP: Success dial '+item.telephone);
          }
        }
        else
        {
          if(res.reason&&res.reason.indexOf('Terminate or hold on the current call first.')>-1)
          {
            //Занято
          }
          else
          {
            _self.refreshMessage(res.uuid);
            if(_self._debugMOD) console.log('SIP: Bad dial '+item.telephone);
          }
        }
       })
       .catch((e)=>{
         console.log('SIP: ',e);
       });
    }
    else if(item.type==='dialup')
    {
      console.log('SIP: YTI');
    }
  }
  dial(phone,message,uuid)
  {
    let _self = this;
    return new Promise((resolve, reject)=>{
      try
      {
        exec('"linphonecsh" dial '+phone, (err, stdout, stderr) => {
          this.last_time_response_linphone = new Date().getTime();
          if(!err&&!stderr&&stdout)
          {
            let temp = stdout.split(',');
            if(temp[1]===undefined)
            {
              resolve({status:false,uuid:uuid,reason:stdout});
              return;
            }
            temp = temp[1].split('\n');
            if(temp[0]!==undefined&&temp[0].indexOf('assigned id')>-1)
            {
              let id = temp[0].replace('assigned id','');
              id = id.replace(/\s+/g,'');
              id = parseInt(id);
              if(!isNaN(id))
              {
                resolve({status:true,uuid:uuid,id:id});
                return;
              }
            }
          }
          if(err)
          {
            if(err.Error == 'Failed to connect pipe: Connection refused')
            {
              console.error('SIP: Failed to connect pipe: Connection refused');
              this.reload();
            }
          }
          resolve({status:false,uuid:uuid,reason:undefined});
          return;
        });
      }
      catch (e)
      {
        reject(e);
        return;
      }
    });
  }
}
module.exports = VegaLinphone;
