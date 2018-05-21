
const VegaSMPP = require('./vega_smpp.js');
const SMSCru = require('./vega_smsc.js');
const VegaLinphone = require('./vega_linphone.js');
const Devices = require('./devices.js');
const VegaWS = require('./vega_ws.js');
const Config = require('./config.js');
const Parser = require('./parser.js');
const { exec } = require('child_process');
const CronJob = require('cron').CronJob;
let devices = new Devices();
let config = {};
let statusAuth = false;
let premission = {};
let smpp = {};
let smsc = {};
let linphone = {};
let ws = {};
//------------------------------------------------------------------------------
//Логика
//------------------------------------------------------------------------------
function sendVoiceMessage(time,channel)
{
  let telephones = [];
  let voiceMess = channel.voice;
  let nameObject = channel.name_level_1;
  let room = channel.level_2;
  let name = channel.name;
  let voiceMessage = channel.voice_message;
  if(channel.telephones)
  {
    telephones = channel.telephones.split(',');
  }
  if(!voiceMessage)
  {
     voiceMessage = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
  }
  if(smsc.active)
  {
    if(voiceMess&&telephones.length>0)
    {
      for (let i = 0 ; i < telephones.length; i++)
      {
        let telephone = telephones[i];
        if(telephone&&telephone.length>0)
        {
          smsc.pushVoiceMessage(voiceMessage,telephone);
        }
      }
    }
    else if(config.debugMOD&&config.telephoneAdministrator)
    {
      smsc.pushVoiceMessage(voiceMessage,config.telephoneAdministrator);
    }
  }
  if(linphone.active)
  {
    if(voiceMess&&telephones.length>0)
    {
      for (let i = 0 ; i < telephones.length; i++)
      {
        let telephone = telephones[i];
        if(telephone&&telephone.length>0)
        {
          linphone.pushVoiceMessage(voiceMessage,telephone);
        }
      }
    }
    else if(config.debugMOD&&config.telephoneAdministrator)
    {
      linphone.pushVoiceMessage(voiceMessage,config.telephoneAdministrator);
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
    if(channel.telephones)
    {
      telephones = channel.telephones.split(',');
    }
    if(!messageSMS)
    {
       messageSMS = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
    }
    if(sms&&telephones.length>0)
    {
      for (let i = 0 ; i < telephones.length; i++)
      {
        let telephone = telephones[i];
        if(telephone&&telephone.length>0)
        {
          smpp.pushSMS(messageSMS,telephone);
        }
      }
    }
    else if(config.debugMOD&&config.telephoneAdministrator)
    {
      smpp.pushSMS(messageSMS,config.telephoneAdministrator);
    }
  }
}
//------------------------------------------------------------------------------
//ws send message
//------------------------------------------------------------------------------
function auth_req()
{
  var message = {
      cmd:'auth_req',
      login:config.loginWS,
      password:config.passwordWS
    };
    ws.send_json(message);
    return;
}
function get_device_appdata_req()
{
  var message = {
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
    devices.list = devices_list;
  }
}
function rx(obj)
{
  try
  {
    //cmd      gatewayId   data       rssi
    //devEui   ack         macData    snr
    //appEui   fcnt        freq       type
    //ts       port        dr         packetStatus?
    let timeServerMs = obj.ts;
    let data = obj.data;
    let devEui = obj.devEui;
    let dev = devices.find(devEui);
    if(dev.valid)
    {
      let dataDevice = new Parser(dev.type,data);
      let currentDate = new Date().getTime();
      let lastDateSMS = dev.lastDateSMS;
      let validBetweenTime =  (dev.lastDateSMS===undefined||(currentDate-lastDateSMS)>config.devices_betweenTimeSMS);
      switch (dev.type) {
        case 1:
          if(config.debugMOD) console.log('data from device SI11');
          break;
        case 2:
          if(config.debugMOD) console.log('data from device SI12');
          break;
        case 3:
          if(config.debugMOD) console.log('data from device SI13');
          break;
        case 4:
          if(config.debugMOD) console.log('data from device TD11');
          break;
        case 5:
          if(config.debugMOD) console.log('data from device TP11');
          break;
        case 6:
          if(config.debugMOD) console.log('data from device MC');
          if(dataDevice.reason==1)
          {
            if(validBetweenTime)
            {
              dev.lastDateSMS = currentDate;
              sendVoiceMessage(timeServerMs,dev.get_channel(1));
              sendSMS(timeServerMs,dev.get_channel(1));
            }
            else
            {
              if(config.debugMOD) console.log('Do not put in the queue');
            }
          }
          break;
        case 7:
          if(config.debugMOD) console.log('data from device AS');
          break;
        case 8:
          if(config.debugMOD) console.log('data from device MS');
          break;
        case 9:
          if(config.debugMOD) console.log('data from device СВЭ-1');
          break;
        case 10:
          if(config.debugMOD) console.log('data from device SS ');
          if(dataDevice.reason==1)
          {
            if(validBetweenTime)
            {
              dev.lastDateSMS = currentDate;
              sendSMS(timeServerMs,dev.get_channel(1));
              sendVoiceMessage(timeServerMs,dev.get_channel(1));
            }
            else
            {
              if(config.debugMOD) console.log('Do not put in the queue');
            }
          }
          break;
        case 11:
          if(config.debugMOD) console.log('data from device SI21');
          break;
        case 12:
          if(config.debugMOD) console.log('data from device УЭ');
          break;
        default:
          if(config.debugMOD) console.log('data from device unknown');
          break;
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
    console.log('Success authorization on server iotvega');
  }
  else
  {
    console.log('Not successful authorization on server iotvega');
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
    }
    catch (e)
    {
      console.log('Initializing the application was a mistake');
      console.error(e);
      process.exit(1);
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
      if(config.debugMOD) console.log('Updates not detected');
    }
    else if (err) {
      console.log(err);
      exec('"git" reset --hard HEAD', (err, stdout, stderr) => {
        if(config.debugMOD) console.log('Error updating IotVegaNotifier, restart',err);
        process.exit(0);
      });
    }
    else
    {
      if(config.debugMOD) console.log('The IotVegaNotifier is updated, restart',stdout);
      process.exit(0);
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
