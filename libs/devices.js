const Device = require('./device.js');
const EventEmitter = require('events');
class Devices extends EventEmitter
{
  constructor()
  {
    super();
    this._list = {};
  }
  set list(l)
  {
    for(let i = 0; i < l.length; i++)
    {
        let dev = l[i];
        if(dev.devEui)
        {
          if(this._list[dev.devEui]===undefined)
          {
            this._list[dev.devEui] = new Device();
          }
          this._list[dev.devEui].refresh(dev);
        }
    }
  }
  find(devEui)
  {
    return this._list[devEui];
  }
}
module.exports = Devices;
