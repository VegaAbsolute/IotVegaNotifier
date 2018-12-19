const net = require('net');
const EventEmitter = require('events');
class VegaTCP extends EventEmitter
{
  constructor(ip,port,active,debugMOD)
  {
    super();
    this.ip = ip;
    this.port = port;
    this._active = active;
    this._debugMOD = debugMOD;
    this._connect = {
      _status:false
    };
    this.reload();
    const intervel = setInterval(()=>{
      if(!this.status)
      {
        let currentDate = new Date().getTime();
        let validLastTimeReconnect = this.last_time_reconnect!==false;
        let lastDate = validLastTimeReconnect?this.last_time_reconnect:currentDate;
        let time = currentDate-lastDate;
        if(time>10000)
        {
          this.reload();
        }
      }
    }, 5000);
  }
  get last_time_reconnect()
  {
    let validLastTimeReconnect = this._connect._last_time_reconnect!==undefined&&typeof this._connect._last_time_reconnect==='number';
    return validLastTimeReconnect?this._connect._last_time_reconnect:false;
  }
  set last_time_reconnect(ltr)
  {
    this._connect._last_time_reconnect = new Date().getTime();
  }
  get status()
  {
    return this._connect._status;
  }
  set status(st)
  {
    this._connect._status = st;
  }
  reload()
  {
    if(this._active)
    {
      let _self = this;
      this._connect = new net.Socket();
      this._connect.connect(this.port,this.ip,this._connected);
      this.status = false;
      this._connect._self = this;
      this.last_time_reconnect = new Date().getTime();
      this._connect.on('close',this._close);           //
      this._connect.on('connect',this._connectTCP);    //
      this._connect.on('data',this._data);             //
      this._connect.on('drain',this._drain);           //
      this._connect.on('end',this._end);               //
      this._connect.on('error',this._error);           //
      this._connect.on('lookup',this._lookup);         //
      this._connect.on('timeout',this._timeout);       //
    }
  }
  _connected()
  {
    console.log(new Date(),'Connected  tcp');
  }
  _close(code)
  {
    console.dir('tcp close',code);
    this._status = false;
  }
  _connectTCP()
  {
    console.log(new Date(),'Successful connection on tcp');
    this._status = true;
    this._self.emit('run');
  }
  _data(d)
  {
    console.dir('_data');
    var mess = '';
    try
    {
      mess = eval(d).toString();
    }
    catch (e)
    {
      mess = 'Dont valid data';
    }
    finally
    {
      this._self.emit('_data',mess);
      console.log(new Date(),mess);
    }
  }
  _drain()
  {
    console.dir('_drain');
    this._self.emit('_drain');
  }
  _end()
  {
    console.dir('_end');
    this._self.emit('_end');
  }
  _error(e)
  {
    console.dir('tcp error',e);
    this._status = false;
    this._self.emit('_error',e);
  }
  _lookup(h)
  {
    console.dir('_lookup',h);
    this._self.emit('_lookup',h);
  }
  _timeout()
  {
    console.dir('_timeout');
    this._self.emit('_timeout');
  }
  send(message)
  {
    // var message = JSON.stringify(message);
		// var messageLength;
		// var buffer;
    // messageLength = Buffer.byteLength(message, 'utf8');
    // buffer = new Buffer(messageLength + 6);
    // buffer.writeUInt16LE(206, 0);
    // buffer.writeUInt32LE(messageLength, 2);
    // buffer.write(message, 6);
    // this._connect.write(buffer);

    // console.log(new Date(),message);
    this._connect.write(message+"\n");
    //this._connect.end();
  }
}
module.exports = VegaTCP;
