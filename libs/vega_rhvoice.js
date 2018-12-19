const { exec } = require('child_process');
const EventEmitter = require('events');
const fs = require('fs');
const wavFileInfo = require('wav-file-info');
class VegaRHvoice extends EventEmitter
{
  constructor(rhvoiceSettings,debugMOD)
  {
    super();
    this._voices = rhvoiceSettings.voices;
    this._process = rhvoiceSettings.process;
    this.md5 = require('md5');
    this.wavList = {};
    this._directory = rhvoiceSettings.directory;
    this._debugMOD = debugMOD;
    this.initialization();
  }
  initialization()
  {
    try
    {
      if (!fs.existsSync(this._directory))
      {
        fs.mkdirSync(this._directory);
      }
      this.statusDir = true;
    }
    catch (e)
    {
      console.log(new Date(),'RHVOICE: Error accessing the directory, perhaps the directory does not exist or insufficient access rights',this._directory);
      this.statusDir = false;
      console.error(new Date(),e);
    }
  }
  getInfoWav(dir)
  {
    var _self = this;
    return new Promise((resolve, reject)=>{
      wavFileInfo.infoByFilename(dir,(err,info)=>{
        if(err)
        {
          reject(err);
          if(_self._debugMOD) console.log(new Date(),'RHVOICE: File status error');
          return;
        }
        resolve(info);
        if(_self._debugMOD) console.log(new Date(),'RHVOICE: File status success');
        return;
      });
    });
  }
  recordWavInfo(hash)
  {
    var _self = this;
    var wav = this.wavList[hash];
    if(wav&&typeof wav =='object')
    {
      this.getInfoWav(wav.directory)
      .then((res)=>{
        wav.info = res;
        wav.status = 'success';
        wav.time = new Date().getTime();
        if(_self._debugMOD) console.log(new Date(),'RHVOICE: Success read wav file '+wav.directory);
        return;
      })
      .catch((e)=>{
        console.error(new Date(),'RHVOICE: ',e);
        return;
      });
    }
  }
  textToSpeech(text)
  {
    var _self = this;
    return new Promise((resolve, reject)=>{
      try
      {
        let hash = _self.md5(text);
        let dir = `${this._directory}/${hash}.wav`;
        if(this.statusDir)
        {
          if(!this.wavList[hash]||this.wavList[hash].status!=='success')
          {
            let currentTime = new Date().getTime();
            let lastTime = currentTime;
            if(!this.wavList[hash])
            {
              lastTime = currentTime;
            }
            else
            {
              lastTime = this.wavList[hash].time?this.wavList[hash].time:currentTime;
            }
            let checkTime = currentTime-lastTime;
            let cmd = `echo "${text}" | ${_self._process} -p "${_self._voices}" -o ${dir}`;
            if(this.wavList[hash] === undefined||this.wavList[hash].status === undefined)
            {
              _self.wavList[hash] = {
                directory:dir,
                time:new Date().getTime(),
                status:'recordingFile'
              };
              if(_self._debugMOD) console.log(new Date(),'RHVOICE: Recording wav file '+dir);
              exec(cmd, (err, stdout, stderr) => {
                if(err)
                {
                  console.error(new Date(),'RHVOICE: ',err);
                  resolve({status:false,hash:hash});
                }
                _self.wavList[hash].status = 'waitingInfoFile';
                _self.wavList[hash].time = new Date().getTime();
                if(_self._debugMOD) console.log(new Date(),'RHVOICE: Waiting info wav file '+dir);

                this.getInfoWav(dir)
                .then((res)=>{
                  _self.wavList[hash].info = res;
                  _self.wavList[hash].status = 'success';
                  _self.wavList[hash].time = new Date().getTime();
                  resolve({status:true,hash:hash});
                })
                .catch((e)=>{
                  console.error(new Date(),'RHVOICE: ',e);
                  resolve({status:false,hash:hash});
                });

              });
            }
            else if(this.wavList[hash].status==='waitingInfoFile'&&(checkTime===0||checkTime>10000))
            {
              this.getInfoWav(dir)
              .then((res)=>{
                _self.wavList[hash].info = res;
                _self.wavList[hash].status = 'success';
                _self.wavList[hash].time = new Date().getTime();
                resolve({status:true,hash:hash});
              })
              .catch((e)=>{
                console.error(new Date(),'RHVOICE: ',e);
                resolve({status:false,hash:hash});
              });
              resolve({status:false,hash:hash});
            }
          }
          else
          {
            if(_self._debugMOD) console.log(new Date(),'RHVOICE: Wav file is found '+dir);
            resolve({status:true,hash:hash});
          }
        }
        else
        {
          if(_self._debugMOD) console.log(new Date(),'RHVOICE: File directory is not available '+this._directory);
          resolve({status:false,hash:hash});
          return;
        }
      }
      catch (e)
      {
        reject(e);
        return;
      }
    });
  }
}
module.exports = VegaRHvoice;
