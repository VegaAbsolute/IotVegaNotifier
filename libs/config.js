let moment = require( 'moment' );
class Config
{
  constructor()
  {
    this._ws={
      url:'ws://0.0.0.0:8002',
      login:'root',
      password:'123'
    };
    this._smpp = {
      address:{},
      system:{},
      status: false,
      info:{}
    };
    this._system = {
      settings:{
        auto_update:false
      }
    };
    this._sip = {
      status: false,
      system: {},  //login password other
      address: {}, //host
      cron: {
        command:'*/1 * * * *'
      },      //command
      rhvoice: {
        fileDirectory:'tmp',
        voices:{
          preferred:'Anna',
          spare:'Alan'
        },
        startupSound:'alert.wav',
        process:'RHVoice-test'
      }   //voices, process, fileDirectory,startupSound
    };
    this._smsc = {
      system:{},
      settings:{
        voice:'w'
      },
      status:false
    };
    this._devices = {
      betweenTimeSMS:30000
    };
    this._baresip = {
      system:{},
      settings:{},
      status:false
    };
    this._debugMOD = {
      status:false,
      settings:{}
    };
  }
  //setters-------------------------
  set ws_user(val)
  {
    this._ws.login = val;
  }
  set ws_password(val)
  {
    this._ws.password = val;
  }
  set ws_address(val)
  {
    this._ws.url = val;
  }
  set smsc_enabled(val)
  {
    this._smsc.status = val;
  }
  set smsc_login(val)
  {
    this._smsc.system.login = val;
  }
  set smsc_password(val)
  {
    this._smsc.system.password = val;
  }
  set smsc_voice(val)
  {
    this._smsc.settings.voice = val;
  }
  set smsc_sender(val)
  {
    this._smsc.settings.sender = val;
  }
  set sip_enabled(val)
  {
    this._sip.status = val;
  }
  set sip_host(val)
  {
    this._sip.address.host = val;
  }
  set sip_user(val)
  {
    this._sip.system.login = val;
  }
  set sip_password(val)
  {
    this._sip.system.password = val;
  }
  set sip_cron(val)
  {
    this._sip.cron = {
      command:val
    };
  }
  set sip_directory(val)
  {
    if(val!==undefined)
    {
      this._sip.rhvoice.fileDirectory = val;
    }
  }
  set sip_startup_sound(val)
  {
    this._sip.rhvoice.startupSound = val;
  }
  set sip_voice_preferred(val)
  {
    this._sip.rhvoice.voices.preferred = val;
  }
  set sip_voice_spare(val)
  {
    this._sip.rhvoice.voices.spare = val;
  }
  set sip_rhvoice(val)
  {
    this._sip.rhvoice.process = val;
  }
  set other_auto_update(val)
  {
    this._system.settings.auto_update = val;
  }
  set other_between_time(val)
  {
    this._devices.betweenTimeSMS = val;
  }
  set other_debug_enabled(val)
  {
    this._debugMOD.status = val;
  }

  set other_debug_phone(val)
  {
    this._debugMOD.settings.telephone = val;
  }
  set smpp_enabled(val)
  {
    this._smpp.status = val;
  }
  set smpp_address(val)
  {
    this._smpp.address.host = val;
  }
  set smpp_port(val)
  {
    this._smpp.address.port = val;
  }
  set smpp_system_id(val)
  {
    this._smpp.system.system_id = val;
  }
  set smpp_password(val)
  {
    this._smpp.system.password = val;
  }
  set smpp_system_type(val)
  {
    this._smpp.system.system_type = val;
  }
  set smpp_interface_version(val)
  {
    this._smpp.system.interface_version = val;
  }
  set smpp_address_range(val)
  {
    this._smpp.system.address_range = val;
  }
  set smpp_addr_ton(val)
  {
    this._smpp.system.addr_ton = val;
  }
  set smpp_addr_npi(val)
  {
    this._smpp.system.addr_npi = val;
  }
  set smpp_source_addr(val)
  {
    this._smpp.info.source_addr = val;
  }
  set smpp_source_addr_ton(val)
  {
    this._smpp.info.source_addr_ton = val?val:0;
  }
  set smpp_service_type(val)
  {
    this._smpp.info.service_type = val;
  }
  set smpp_source_addr_npi(val)
  {
    this._smpp.info.source_addr_npi = val;
  }
  set smpp_dest_addr_ton(val)
  {
    this._smpp.info.dest_addr_ton = val;
  }
  set smpp_dest_addr_npi(val)
  {
    this._smpp.info.dest_addr_npi = val;
  }
  set smpp_esm_class(val)
  {
    this._smpp.info.esm_class = val;
  }
  set smpp_protocol_id(val)
  {
    this._smpp.info.protocol_id = val;
  }
  set smpp_priority_flag(val)
  {
    this._smpp.info.priority_flag = val;
  }
  set smpp_schedule_delivery_time(val)
  {
    this._smpp.info.schedule_delivery_time = val;
  }
  set smpp_validity_period(val)
  {
    this._smpp.info.validity_period = val;
  }
  set smpp_registered_delivery(val)
  {
    this._smpp.info.registered_delivery = val;
  }
  set smpp_replace_if_present_flag(val)
  {
    this._smpp.info.replace_if_present_flag = val;
  }
  set smpp_data_coding(val)
  {
    this._smpp.info.data_coding = val;
  }
  set smpp_sm_default_msg_id(val)
  {
    this._smpp.info.sm_default_msg_id = val;
  }
  //getters-------------------------
  get ws()
  {
    return this._ws.url;
  }
  get loginWS()
  {
    return this._ws.login.toString();
  }
  get passwordWS()
  {
    return this._ws.password.toString();
  }
  get smsc()
  {
    return this._smsc.status;
  }
  get smsc_settings()
  {
    return this._smsc.settings;
  }
  get smsc_auth()
  {
    return this._smsc.system;
  }
  get sipHost()
  {
    return this._sip.address.host;
  }
  get sipLogin()
  {
    return this._sip.system.login;
  }
  get sipPassword()
  {
    return this._sip.system.password;
  }
  get sipOtherSettings()
  {
    return this._sip.system.other;
  }
  get sipRHvoice()
  {
    return {
      voices:this._sip.rhvoice.voices.preferred+'+'+this._sip.rhvoice.voices.spare,
      process:this._sip.rhvoice.process,
      directory:this._sip.rhvoice.fileDirectory,
      startupSound:this._sip.rhvoice.startupSound
    };
  }
  get sipCron()
  {
    if(typeof this._sip.cron === 'object')
    {
      return this._sip.cron.command;
    }
    else
    {
      return undefined;
    }
  }
  get sip()
  {
    return this._sip.status;
  }
  get devices_betweenTimeSMS()
  {
    return this._devices.betweenTimeSMS;
  }
  get debugMOD()
  {
    return this._debugMOD.status;
  }
  get telephoneAdministrator()
  {
    return this._debugMOD.settings.telephone
  }
  get address_smpp()
  {
    return this._smpp.address;
  }
  get smpp_info()
  {
    return this._smpp.info;
  }
  get system_smpp()
  {
    return this._smpp.system;
  }
  get smpp()
  {
    return this._smpp.status;
  }
  get auto_update()
  {
    return this._system.settings.auto_update;
  }
  //methods
  setFromConfig(config)
  {
    for (let section in config)
    {
      try
      {
        for(let param in config[section])
        {
          this[section+'_'+param] = config[section][param];
        }
      }
      catch (e)
      {
        console.error(moment().format('LLL')+': ',e);
        return false;
      }
    }
    return true;
  }
  valid()
  {
    return true;
  }
  //rudiments
  set devices_between_time(val)
  {
    this._devices.betweenTimeSMS = val;
  }
  set debug_enabled(val)
  {
    this._debugMOD.status = val;
  }
  set debug_phone(val)
  {
    this._debugMOD.settings.telephone = val;
  }
  get baresip()
  {
    return this._baresip.status;
  }
  get baresipIP()
  {
    return this._baresip.system.ip;
  }
  get baresipPort()
  {
    return this._baresip.system.port;
  }
  get baresipType()
  {
    return this._baresip.settings.type;
  }
  set baresip(val)
  {
    this._baresip.status = val;
  }
  baresip_address(ip,port,type)
  {
    this._baresip.system.ip = ip;
    this._baresip.system.port = port;
    this._baresip.settings.type = type;
  }

}
module.exports = Config;
