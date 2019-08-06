
const VegaSMPP = require('./vega_smpp.js');
const SMSCru = require('./vega_smsc.js');
const VegaLinphone = require('./vega_linphone.js');
const Devices = require('./devices.js');
const VegaWS = require('./vega_ws.js');
const Config = require('./config.js');
const Parser = require('./parser.js');
const { exec } = require('child_process');
const CronJob = require('cron').CronJob;
let moment = require( 'moment' );
let devices = new Devices();
let config = {};
let statusAuth = false;
let premission = {};
let smpp = {};
let smsc = {};
let linphone = {};
let ws = {};
let waitingReboot = false;
//------------------------------------------------------------------------------
//Логика
//------------------------------------------------------------------------------
function checkValidRXType(type)
{
  try
  {
    let validType = typeof type === 'string';
    if(!validType) return false;
    let types = type.split('+');
    if( types.indexOf( 'UNCONF_UP' ) > -1 || types.indexOf( 'CONF_UP' ) > -1 )
    {
      return true;
    }
    return false;
  }
  catch (e)
  {
    return false;
  }
}
function wasAlarm(time,channel)
{
  if(!channel.enable_danger) return;
  sendSMS(time,channel);
  sendVoiceMessage(time,channel);
}
function getValidTelephone(num)
{
  try
  {
    let validNum = num&&num.length>0?true:false;
    if(!validNum) return false;
    telephone = num.replace(/[^-0-9]/gim,'');
    let validTelephone = telephone&&telephone.length>0?true:false;
    if(!validTelephone) return false;
    if(telephone.length === 11 && telephone[0] == 8)
    {
      telephone = telephone.replace(8,7);
    }
    return telephone;
  }
  catch (e)
  {
    return false;
  }
}
function sendVoiceMessage(time,channel)
{
  let telephones = [];
  let voiceMess = channel.voice;
  let nameObject = channel.name_level_1;
  let room = channel.level_2;
  let name = channel.name;
  let voiceMessage = channel.voice_message;
  let voiceMessage_admin = 'undefined';
  if(channel.telephones)
  {
    telephones = channel.telephones.split(',');
  }
  if(!voiceMessage)
  {
     voiceMessage = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
  }
  voiceMessage_admin = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
  if(voiceMess)
  {
    if(smsc.active)
    {
      if(telephones.length>0)
      {
        for (let i = 0 ; i < telephones.length; i++)
        {
          let telephone = getValidTelephone(telephones[i]);
          if(telephone!==false)
          {
            smsc.pushVoiceMessage(voiceMessage,telephone,new Date().getTime());
          }
        }
      }
      if(config.debugMOD&&config.telephoneAdministrator)
      {
        smsc.pushVoiceMessage(voiceMessage_admin,config.telephoneAdministrator,new Date().getTime());
      }
    }
    if(linphone.active)
    {
      if(telephones.length>0)
      {
        for (let i = 0 ; i < telephones.length; i++)
        {
          let telephone = getValidTelephone(telephones[i]);
          if(telephone!==false)
          {
            linphone.pushVoiceMessage(voiceMessage,telephone,new Date().getTime());
          }
        }
      }
      if(config.debugMOD&&config.telephoneAdministrator)
      {
        linphone.pushVoiceMessage(voiceMessage_admin,config.telephoneAdministrator,new Date().getTime());
      }
    }
  }
}
function sendSMS(time,channel)
{
  if(smpp.active)
  {
    let telephones = [];
    let sms = channel.sms;
    let nameObject = channel.name_level_1;
    let room = channel.level_2;
    let name = channel.name;
    let messageSMS = channel.message_sms;
    let messageSMS_admin = 'undefined';
    if(channel.telephones)
    {
      telephones = channel.telephones.split(',');
    }
    if(!messageSMS)
    {
       messageSMS = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
    }
    messageSMS_admin = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
    if(sms)
    {
      if(telephones.length>0)
      {
        for (let i = 0 ; i < telephones.length; i++)
        {
          let telephone = getValidTelephone(telephones[i]);
          if(telephone!==false)
          {
            smpp.pushSMS(messageSMS,telephone,new Date().getTime());
          }
        }
      }
      if(config.debugMOD&&config.telephoneAdministrator)
      {
        smpp.pushSMS(messageSMS_admin,config.telephoneAdministrator,new Date().getTime());
      }
    }
  }
}
//------------------------------------------------------------------------------
//ws send message
//------------------------------------------------------------------------------
function auth_req()
{
  let message = {
      cmd:'auth_req',
      login:config.loginWS,
      password:config.passwordWS
    };
    ws.send_json(message);
    return;
}
function get_device_appdata_req()
{
  let message = {
    cmd:'get_device_appdata_req',
    keyword:['add_data_info']
  };
  ws.send_json(message);
  return;
}
//------------------------------------------------------------------------------
//commands iotvega.com
//------------------------------------------------------------------------------
function get_device_appdata_resp(obj)
{
  let devices_list = obj.devices_list;
  let validDevicesList = typeof devices_list==='object'&&devices_list.length>0;
  if(validDevicesList)
  {
    if(config.debugMOD) console.log(moment().format('LLL')+': '+'devices list updated');
    devices.list = devices_list;
  }
}
function rx(obj)
{
  if(!(obj.type&&checkValidRXType(obj.type))) return;
  try
  {
    //cmd      gatewayId   data       rssi
    //devEui   ack         macData    snr
    //appEui   fcnt        freq       type
    //ts       port        dr         packetStatus?
    let timeServerMs = obj.ts;
    let data = obj.data;
    let devEui = obj.devEui;
    let port = obj.port;
    let dev = devices.find(devEui);
    if(dev.valid)
    {
      let dataDevice = new Parser(dev.type,data,port);
      let currentDate = new Date().getTime();
      let lastDateSMS = dev.lastDateSMS;
      let validBetweenTime =  (dev.lastDateSMS===undefined||(currentDate-lastDateSMS)>config.devices_betweenTimeSMS);
      let validNumChannel = dataDevice.num_channel!==undefined;
      let numChannel = validNumChannel?parseInt(dataDevice.num_channel):1;
      if(validBetweenTime)
      {
        switch (dev.type)
        {
          case 1:
          {
            if(validNumChannel)
            {
              let channel = dev.get_channel(numChannel);
              let validChannel = channel!==undefined&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel&&dataDevice.type_package==2)
              {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel);
              }
            }
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI11');
            break;
          }
          case 2:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI12');
            break;
          }

          case 3:
          {
              if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI13');
              break;
          }
          case 4:
          {
            let channel = dev.get_channel(1);
            let validChannel = channel!==undefined&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let checkEvent = dataDevice.reason!==0;
              let t = parseInt(dataDevice.temperature);
              let t_max = channel.max_t;
              let t_min = channel.min_t;
              let checkTemperature = t<=t_min||t>=t_max;
              if(checkEvent||checkTemperature)
              {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel);
              }
            }
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device TD11');
            break;
          }
          case 5:
          {
            let channel = dev.get_channel(1);
            let validChannel = channel!==undefined&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let s = parseFloat(dataDevice.sensorTP);
              let dangerEvent = dataDevice.sensor_danger_1||dataDevice.sensor_danger_2?true:false;
              let validValue = s!==undefined&&typeof s === 'number';
              let sensorEvent = false;
              let min = parseFloat(channel.min_normal_v);
              let max = parseFloat(channel.max_normal_v);
              let min_v = parseFloat(channel.min_v);
              let max_v = parseFloat(channel.max_v);
              if(validValue&&!isNaN(min)&&!isNaN(max)&&!isNaN(min_v)&&!isNaN(max_v))
              {
                  if(s===0)
                  {
                      sensorEvent = true;
                  }
                  else if(s<=20&&s>=4)
                  {
                      let newvalue = min_v+(((max_v-min_v)*(s-4))/16);
                      if(typeof newvalue === 'number')
                      {
                          if(newvalue<=min||newvalue>=max)
                          {
                              sensorEvent = true;
                          }
                      }
                  }
                  else
                  {
                     sensorEvent = true;
                  }
              }
              if(sensorEvent||dangerEvent)
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel);
              }
            }
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device TP11');
            break;
          }
          case 6:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MC');
            if(dataDevice.reason==1)
            {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,dev.get_channel(1));
            }
            break;
          }
          case 7:
          {
            if(dataDevice.reason==1)
            {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,dev.get_channel(1));
            }
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device AS');
            break;
          }
          case 8:
          {
            if(dataDevice.reason==1)
            {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,dev.get_channel(1));
            }
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MS');
            break;
          }
          case 9:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device СВЭ-1');
            break;
          }
          case 10:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SS ');
            if(dataDevice.reason==1)
            {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,dev.get_channel(1));
            }
            break;
          }
          case 11:
          {
            if(validNumChannel)
            {
              let channel = dev.get_channel(numChannel);
              let validChannel = channel!==undefined&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel&&dataDevice.type_package==2)
              {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,dev.get_channel(numChannel));
              }
            }
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI21');
            break;
          }
          case 12:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device UE');
            break;
          }
          case 13:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device UG ');
            let reason = dataDevice.reason!==undefined?parseInt(dataDevice.reason):NaN;
            if(!isNaN(reason)&&reason>0)
            {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,dev.get_channel(1));
            }
            break;
          }
          case 14:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device LM-1 ');
            if(dataDevice.alarm)
            {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,dev.get_channel(1));
            }
            break;
          }
          case 15:
          {
            let channel = dev.get_channel(1);
            let validChannel = channel!==undefined&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let checkEvent = dataDevice.reason!=='00';
              let t = parseFloat(dataDevice.temperature);
              let t2 = parseFloat(dataDevice.temperature_2);
              let t_max = channel.max_t;
              let t_min = channel.min_t;
              let checkTemperature = t<=t_min||t>=t_max;
              let checkTemperature_2 = t2<=t_min||t2>=t_max;
              if(checkEvent||checkTemperature||checkTemperature_2)
              {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel);
              }
            }
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device TD11');
            break;
          }
          default:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device unknown');
            break;
          }
        }
      }
      else
      {
        if(config.debugMOD) console.log(moment().format('LLL')+': '+'Do not put in the queue');
      }
    }
  }
  catch (e)
  {
    console.error(e);
  }
  finally
  {
    return;
  }
}
function free()
{
  if(waitingReboot)
  {
    emergencyExit();
  }
}
function emergencyExit()
{
  if(smpp.employment||smsc.employment||linphone.employment)
  {
    return;
  }
  process.exit(1);
}
function auth_resp(obj)
{
  if(obj.status)
  {
    for(let i = 0 ; i<obj.command_list.length;i++)
    {
      premission[obj.command_list[i]] = true;
    }
    statusAuth = true;
    get_device_appdata_req();
    console.log(moment().format('LLL')+': '+'Success authorization on server iotvega');
  }
  else
  {
    console.log(moment().format('LLL')+': '+'Not successful authorization on server iotvega');
    emergencyExit();
  //  process.exit(1);
  }
}
//------------------------------------------------------------------------------
//initalization app
//------------------------------------------------------------------------------
function initWS()
{
  ws = new VegaWS(config.ws);
  ws.on('run',auth_req);
  ws.on('auth_resp',auth_resp);
  ws.on('rx',rx);
  ws.on('alter_user_resp',get_device_appdata_req);
  ws.on('get_device_appdata_resp',get_device_appdata_resp);
}
function run(conf)
{
  config = conf;
  if(config.valid())
  {
    if(config.auto_update)
    {
      new CronJob({
        cronTime: '*/1 * * * *',
        onTick: updating,
        start: true,
      });
    }
    try
    {
      initWS();
      smpp = new VegaSMPP(config.address_smpp,config.system_smpp,config.smpp_info,config.smpp,config.debugMOD);
      smsc = new SMSCru(config.smsc_auth,config.smsc,config.smsc_settings,config.debugMOD);
      linphone = new VegaLinphone(config.sipHost,config.sipLogin,config.sipPassword,config.sipOtherSettings,config.sipCron,config.sipRHvoice,config.sip,config.debugMOD);
      smpp.on('free',free);
      smsc.on('free',free);
      linphone.on('free',free);
    }
    catch (e)
    {
      console.log(moment().format('LLL')+': '+'Initializing the application was a mistake');
      console.error(moment().format('LLL'),e);
      emergencyExit();
    }
  }
  return;
}
function updating()
{
    //тут нужно проверить что программа не чем не занята
  exec('"git" pull', (err, stdout, stderr) => {
    if(stdout&&(stdout.indexOf('Already up to date')>-1||stdout.indexOf('Already up-to-date')>-1)||stdout.indexOf('Уже обновлено')>-1)
    {
      if(config.debugMOD) console.log(moment().format('LLL')+': '+'Updates not detected');
    }
    else if (err) {
      console.log(err);
      exec('"git" reset --hard HEAD', (err, stdout, stderr) => {
        if(config.debugMOD) console.log(moment().format('LLL')+': '+'Error updating IotVegaNotifier, restart',err);
        emergencyExit();
      });
    }
    else
    {
      if(config.debugMOD) console.log(moment().format('LLL')+': '+'The IotVegaNotifier is updated, restart',stdout);
      waitingReboot = true;
      emergencyExit();
    }
  });
}
setInterval(()=>{
  if(ws.status&&statusAuth)
  {
    get_device_appdata_req();
  }
}, 30000);
module.exports.config = config;
module.exports.run = run;
