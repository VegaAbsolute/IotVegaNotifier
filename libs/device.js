//device.js version 2.0.0 lite
const Channel = require('./channel.js');
let devicesInfo = require('./vega_base_data.js').devicesInfo; 
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
  get version()
  {
    return this._version;
  }
  set version ( value )
  {
    if( value === undefined )
    {
      value = this.getFirstVersion();
    }
    value = parseInt(value);
    if( isNaN(value) ) value = 0;
    this._version=value;
  }
  getFirstVersion()
  {
    for( let i = 0; i < devicesInfo.length; i++)
    {
      let devInfo = devicesInfo[i];
      if( this.type == devInfo.id )
      {
        return devInfo.versions.first;
      }
    }
    return 0;
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
    this.version = obj.version;
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
