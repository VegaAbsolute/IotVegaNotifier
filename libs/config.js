let moment = require( 'moment' );
const uuidv4 = require('uuid/v4');
const logger = require('./vega_logger.js');
class Config
{
  constructor()
  {
    this._ws={
      url:'ws://0.0.0.0:8002',
      login:'root',
      password:'123'
    };
    this._smtp = {
      status:false,
      host:'smpt.example.com',
      port:465,
      secure:true,
      user:'',
      password:''
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
      }
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
    this._telegram = {
      status:false,
      token:undefined,
      chatId:undefined,
      proxy:{
        status:false,
        host:undefined,
        port:undefined,
        login:undefined,
        password:undefined,
        type: 'socks5'
      }
    };
    this._administrator = {
      status:false,
      settings:{
        gateway_active: false,
        gateway_inactive: false,
        server_not_available: false,
        test_startup_message: false,
        phone: undefined
      }
    };
    this._debugMOD = {
      status:false,
      settings:{}
    };
  }
  //setters-------------------------
  set administrator_enabled(val)
  {
    this._administrator.status = val;
  }
  set administrator_gateway_active(val)
  {
    this._administrator.settings.gateway_active = val;
  }
  set administrator_gateway_inactive(val)
  {
    this._administrator.settings.gateway_inactive = val;
  }
  set administrator_server_not_available(val)
  {
    this._administrator.settings.server_not_available = val;
  }
  set administrator_test_startup_message(val)
  {
    this._administrator.settings.test_startup_message = val;
  }
  set administrator_administrator_phone(val)
  {
    this._administrator.settings.phone = val;
  }
  set smtp_enabled(val)
  {
    this._smtp.status = val;
  }
  set smtp_host(val)
  {
    this._smtp.host = val;
  }
  set smtp_port(val)
  {
    this._smtp.port = val;
  }
  set smtp_secure(val)
  {
    this._smtp.secure = val;
  }
  set smtp_user(val)
  {
    this._smtp.user = val;
  }
  set smtp_password(val)
  {
    this._smtp.password = val;
  }
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
  set telegram_enabled(val)
  {
    this._telegram.status = val;
  }
  set telegram_bot_token(val)
  {
    this._telegram.token = val;
  }
  set telegram_administartor_chat_id(val)
  {
    this._telegram.chatId = val;
  }
  set telegram_proxy_socks5_host(val)
  {
    this._telegram.proxy.host = val;
  }
  set telegram_proxy_socks5_enabled(val)
  {
    this._telegram.proxy.status = val;
  }
  set telegram_proxy_socks5_port(val)
  {
    this._telegram.proxy.port = val;
  }
  set telegram_proxy_socks5_name(val)
  {
    this._telegram.proxy.login = val;
  }
  set telegram_proxy_socks5_password(val)
  {
    this._telegram.proxy.password = val;
  }
  //getters-------------------------
  get smtp()
  {
    return this._smtp.status;
  }
  get smtp_host()
  {
    return this._smtp.host;
  }
  get smtp_port()
  {
    return this._smtp.port;
  }
  get smtp_secure()
  {
    return this._smtp.secure;
  }
  get smtp_user()
  {
    return this._smtp.user;
  }
  get smtp_password()
  {
    return this._smtp.password;
  }
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
    return this._administrator.settings.phone
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
  get telegram()
  {
    return this._telegram.status;
  }
  get telegram_bot_token()
  {
    return this._telegram.token;
  }
  get telegram_admin_chatId()
  {
    return this._telegram.chatId;
  }
  get telegram_proxy()
  {
    return this._telegram.proxy;
  }
  get administrator()
  {
    return this._administrator.status;
  }
  get gateway_active()
  {
    return this._administrator.settings.gateway_active;
  }
  get gateway_inactive()
  {
    return this._administrator.settings.gateway_inactive;
  }
  get server_not_available()
  {
    return this._administrator.settings.server_not_available;
  }
  get test_startup_message()
  {
    return this._administrator.settings.test_startup_message;
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
        logger.log({
          level:'error',
          message:'ERROR 1',
          module:'[PARS_CONFIG]',
          time:moment().format('LLL'),
          timestamp:parseInt(moment().format('x')),
          uuid:uuidv4()
        });
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
}
module.exports = Config;
