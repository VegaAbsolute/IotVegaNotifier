const Channel = require('./channel.js');
class Device
{
  constructor()
  {
    this._appEui;
    this._devEui;
    this._devName;
    this._type;
    this._fcnt_down;
    this._fcnt_up;
    this._last_data_ts;
    this._channels=[];
  }
  get_channel(index)
  {
    return this._channels[index];
  }
  get type()
  {
    return parseInt(this._type);
  }
  get valid()
  {
    return this._devEui!==undefined&&this._type!==undefined;
  }
  refresh(obj)
  {
    this._appEui = obj.appEui;
    this._devEui = obj.devEui;
    this._devName = obj.devName;
    this._type = obj.device_type;
    this._fcnt_down = obj.fcnt_down;
    this._fcnt_up = obj.fcnt_up;
    this._last_data_ts = obj.last_data_ts;

    for(let key in obj)
    {
      if(key.indexOf('other_info')>-1)
      {
        let index =  parseInt(key.replace('other_info_',''));
        if(!isNaN(index))
        {
          if(this._channels[index]===undefined)
          {
            this._channels[index] = new Channel();
          }
          this._channels[index].refresh(obj[key]);
        }
      }
    }
  }
}
module.exports = Device;
