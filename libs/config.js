//config.js version 2.0.0 lite
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
      status: false
    };
    this._system = {
      auto_update:false,
      betweenTimeSMS:30000,
      debugMOD:false
    };
    this._smsc = {
      voice:'w',
      status:false
    };
    this._telegram = {
      status:false,
      token:undefined,
      chatId:undefined,
      proxy_status:false,
      proxy_host:undefined,
      proxy_port:undefined,
      proxy_login:undefined,
      proxy_password:undefined,
      proxy_type: 'socks5'
    };
    this._administrator = {
      status:false,
      gateway_active: false,
      gateway_inactive: false,
      server_not_available: false,
      test_startup_message: false,
      low_battery: false,
      phone: undefined
    };
    this._http = {
      status: true,
      port:4040,
      ip: '127.0.0.1',
      login: 'iotvega',
      password: 'iotvega',
      key:'0000-0000-0000-ffff'
    };
  }
  //setters-------------------------
  set administrator_status(val)
  {
    this._administrator.status = val;
  }
  set administrator_gateway_active(val)
  {
    this._administrator.gateway_active = val;
  }
  set administrator_gateway_inactive(val)
  {
    this._administrator.gateway_inactive = val;
  }
  set administrator_server_not_available(val)
  {
    this._administrator.server_not_available = val;
  }
  set administrator_low_battery(val)
  {
    this._administrator.low_battery = val;
  }
  set administrator_test_startup_message(val)
  {
    this._administrator.test_startup_message = val;
  }
  set administrator_phone(val)
  {
    this._administrator.phone = val;
  }
  set http_status(val)
  {
    this._http.status = val;
  }
  set http_ip(val)
  {
    this._http.ip = val;
  }
  set http_login(val)
  {
    this._http.login = val;
  }
  set http_password(val)
  {
    this._http.password = val;
  }
  set http_key(val)
  {
    this._http.key = val;
  }
  set http_port(val)
  {
    this._http.port = val;
  }
  set smtp_status(val)
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
  set ws_login(val)
  {
    this._ws.login = val;
  }
  set ws_password(val)
  {
    this._ws.password = val;
  }
  set ws_url(val)
  {
    this._ws.url = val;
  }
  set smsc_status(val)
  {
    this._smsc.status = val;
  }
  set smsc_login(val)
  {
    this._smsc.login = val;
  }
  set smsc_password(val)
  {
    this._smsc.password = val;
  }
  set smsc_voice(val)
  {
    this._smsc.voice = val;
  }
  set smsc_sender(val)
  {
    this._smsc.sender = val;
  }
  set system_auto_update(val)
  {
    this._system.auto_update = val;
  }
  set system_betweenTimeSMS(val)
  {
    this._system.betweenTimeSMS = val;
  }
  set system_debugMOD(val)
  {
    this._system.debugMOD = val;
  }
  set smpp_status(val)
  {
    this._smpp.status = val;
  }
  set smpp_host(val)
  {
    this._smpp.host = val;
  }
  set smpp_port(val)
  {
    this._smpp.port = val;
  }
  set smpp_system_id(val)
  {
    this._smpp.system_id = val;
  }
  set smpp_password(val)
  {
    this._smpp.password = val;
  }
  set smpp_system_type(val)
  {
    this._smpp.type = val;
  }
  set smpp_interface_version(val)
  {
    this._smpp.interface_version = val;
  }
  set smpp_address_range(val)
  {
    this._smpp.address_range = val;
  }
  set smpp_addr_ton(val)
  {
    this._smpp.addr_ton = val;
  }
  set smpp_addr_npi(val)
  {
    this._smpp.addr_npi = val;
  }
  set smpp_source_addr(val)
  {
    this._smpp.source_addr = val;
  }
  set smpp_source_addr_ton(val)
  {
    this._smpp.source_addr_ton = val?val:0;
  }
  set smpp_service_type(val)
  {
    this._smpp.service_type = val;
  }
  set smpp_source_addr_npi(val)
  {
    this._smpp.source_addr_npi = val;
  }
  set smpp_dest_addr_ton(val)
  {
    this._smpp.dest_addr_ton = val;
  }
  set smpp_dest_addr_npi(val)
  {
    this._smpp.dest_addr_npi = val;
  }
  set smpp_esm_class(val)
  {
    this._smpp.esm_class = val;
  }
  set smpp_protocol_id(val)
  {
    this._smpp.protocol_id = val;
  }
  set smpp_priority_flag(val)
  {
    this._smpp.priority_flag = val;
  }
  set smpp_schedule_delivery_time(val)
  {
    this._smpp.schedule_delivery_time = val;
  }
  set smpp_validity_period(val)
  {
    this._smpp.validity_period = val;
  }
  set smpp_registered_delivery(val)
  {
    this._smpp.registered_delivery = val;
  }
  set smpp_replace_if_present_flag(val)
  {
    this._smpp.replace_if_present_flag = val;
  }
  set smpp_data_coding(val)
  {
    this._smpp.data_coding = val;
  }
  set smpp_sm_default_msg_id(val)
  {
    this._smpp.sm_default_msg_id = val;
  }
  set telegram_status(val)
  {
    this._telegram.status = val;
  }
  set telegram_token(val)
  {
    this._telegram.token = val;
  }
  set telegram_chatId(val)
  {
    this._telegram.chatId = val;
  }
  set telegram_proxy_host(val)
  {
    this._telegram.proxy_host = val;
  }
  set telegram_proxy_type(val)
  {
    this._telegram.proxy_type = val;
  }
  set telegram_proxy_status(val)
  {
    this._telegram.proxy_status = val;
  }
  set telegram_proxy_port(val)
  {
    this._telegram.proxy_port = val;
  }
  set telegram_proxy_name(val)
  {
    this._telegram.proxy_login = val;
  }
  set telegram_proxy_password(val)
  {
    this._telegram.proxy_password = val;
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
    var res = {
      voice:this._smsc.voice,
      sender:this._smsc.sender
    };
    for(var key in res)
    {
      if( res[key] === undefined ) delete res[key];
    }
    return res;
  }
  get smsc_auth()
  {
    return {
      login:this._smsc.login,
      password:this._smsc.password
    };
  }
  
  get devices_betweenTimeSMS()
  {
    return this._system.betweenTimeSMS;
  }
  get debugMOD()
  {
    return this._system.debugMOD;
  }
  get telephoneAdministrator()
  {
    return this._administrator.phone
  }
  get address_smpp()
  {
    return {
      host:this._smpp.host,
      port:this._smpp.port
    };
  }
  get smpp_info()
  {
    let res = {
      source_addr:this._smpp.source_addr,
      source_addr_ton:this._smpp.source_addr_ton,
      service_type:this._smpp.service_type,
      source_addr_npi:this._smpp.source_addr_npi,
      dest_addr_ton:this._smpp.dest_addr_ton,
      dest_addr_npi:this._smpp.dest_addr_npi,
      esm_class:this._smpp.esm_class,
      protocol_id:this._smpp.protocol_id,
      priority_flag:this._smpp.priority_flag,
      schedule_delivery_time:this._smpp.schedule_delivery_time,
      validity_period:this._smpp.validity_period,
      registered_delivery:this._smpp.registered_delivery,
      replace_if_present_flag:this._smpp.replace_if_present_flag,
      data_coding:this._smpp.data_coding,
      sm_default_msg_id:this._smpp.sm_default_msg_id,
    };
    for(var key in res)
    {
      if( res[key] === undefined ) delete res[key];
    }
    return res;
  }
  get system_smpp()
  {
    let res = {
      system_id:this._smpp.system_id,
      password:this._smpp.password,
      type:this._smpp.type,
      interface_version:this._smpp.interface_version,
      address_range:this._smpp.address_range,
      addr_ton:this._smpp.addr_ton,
      addr_npi:this._smpp.addr_npi
    };
    for(var key in res)
    {
      if( res[key] === undefined ) delete res[key];
    }
    return res;
  }
  get smpp()
  {
    return this._smpp.status;
  }
  get auto_update()
  {
    return this._system.auto_update;
  }
  get telegram()
  {
    return this._telegram.status;
  }
  get telegram_token()
  {
    return this._telegram.token;
  }
  get telegram_chatId()
  {
    return this._telegram.chatId;
  }
  get telegram_proxy()
  {
    var res = {
      proxy_status:this._telegram.proxy_status,
      proxy_host:this._telegram.proxy_host,
      proxy_port:this._telegram.proxy_port,
      proxy_login:this._telegram.proxy_login,
      proxy_password:this._telegram.proxy_password,
      proxy_type:this._telegram.proxy_type

    }
    for(var key in res)
    {
      if( res[key] === undefined ) delete res[key];
    }
    return res;
  }
  get http()
  {
    return this._http.status;
  }
  get http_ip()
  {
    return this._http.ip;
  }
  get http_login()
  {
    return this._http.login;
  }
  get http_password()
  {
    return this._http.password;
  }
  get http_key()
  {
    return this._http.key;
  }
  get http_port()
  {
    return this._http.port;
  }
  get administrator()
  {
    return this._administrator.status;
  }
  get gateway_active()
  {
    return this._administrator.gateway_active;
  }
  get gateway_inactive()
  {
    return this._administrator.gateway_inactive;
  }
  get server_not_available()
  {
    return this._administrator.server_not_available;
  }
  get test_startup_message()
  {
    return this._administrator.test_startup_message;
  }
  get low_battery()
  {
    return this._administrator.low_battery;
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
