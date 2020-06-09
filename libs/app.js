
//app.js version 1.1.5 lite
const VegaSMPP = require('./vega_smpp.js');
const VegaTelegram = require('./vega_telegram.js');
const VegaSMTP = require('./vega_smtp.js');
const SMSCru = require('./vega_smsc.js');
const Devices = require('./devices.js');
const VegaWS = require('./vega_ws.js');
const Config = require('./config.js');
const Parser = require('./parser.js');
const { exec } = require('child_process');
const { spawn } = require('child_process');
const CronJob = require('cron').CronJob;
const Which = require('which');
const CRON_TIME = '*/1 * * * *';
let moment = require( 'moment' );
let devices = new Devices();
let config = {};
let statusAuth = false;
let premission = {};
let smpp = {};
let smsc = {};
let telegram = {};
let smtp = {};
let ws = {};
let waitingReboot = false;
let npm = 'npm';
let spawn_update;
//------------------------------------------------------------------------------
//Логика
//------------------------------------------------------------------------------
//Проверка текста на пустату
function isEmptyText(text)
{
  return text === undefined || text === '' || text === ' ' || text === null;
}
//Функция генерации сообщения формата notifier
function generationMessage(channel)
{
  let messageSMS = '';
  let nameObject = channel.name_level_1;
  let room = channel.level_2;
  let name = channel.name;
  if(isEmptyText(nameObject)) nameObject = 'который не известен';
  if(isEmptyText(room)) room = 'которое не известно';
  if(isEmptyText(name)) name = 'который не известен';
  messageSMS = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
  return messageSMS;
}
//Функция расшифровки причины
parseReason(typeDev,version,reason,channel)
{
  if ( typeDev == 'td11' )
  {
    if ( reason === 0 || reason === '0' ) return 'По времени';
    if ( reason === 1 ) return channel.security_name;
    if ( reason === 2 ) return 'Вскрытие';
    if ( reason === 3 ) return channel.hall_1_name;
    if ( reason === 4 ) return channel.hall_2_name;
    if ( version == 1 )
    {
      if( reason == 5 ) return 'Отклонение температуры';
    }
  }
  return 'Неизвестна';
}
//RX пакеты которые приложение будет учитывать
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
//Функция отправки сообщений о тревогах
function wasAlarm(time,channel,fcnt,devEui,otherInfo)
{
  if(!channel.enable_danger) return; //Если отправка тревожных событий отключена то следует прекратить выполнение данного сценария.
  if(config.debugMOD) console.log(moment().format('LLL')+': '+' Detected alarm DevEui',devEui,'  fcnt:',fcnt);
  sendSMS(time,channel,otherInfo);
  sendVoiceMessage(time,channel,otherInfo);
  sendTelegram(time,channel,otherInfo);
  sendSMTP(time,channel,otherInfo);
}
//Функция валидации и привидение введенного номера телефона к нужному формату.
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
//Функция валидации и привидение введенного email к нужному формату.
function getValidEmail(email)
{
  try
  {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let validEmail = email&&email.length>0?true:false;
    if(!validEmail) return false;
    email = email.replace(/\s+/g, '');
    if(!reg.test(email)) return false;
    return email;
  }
  catch (e)
  {
    return false;
  }
}
//Функция валидации и привидение текстового сообщения к нужному формату.
function getValidChat(val)
{
  try
  {
    let valid = val&&val.length>0?true:false;
    if(!valid) return false;
    chat = val.replace(/[^-0-9]/gim,'');
    let validChat = chat&&chat.length>0?true:false;
    if(!validChat) return false;
    return chat;
  }
  catch (e)
  {
    return false;
  }
}
function sendVoiceMessage(time,channel,otherInfoDanger)
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
  }
}
function sendSMS(time,channel,otherInfoDanger)
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
function sendTelegram(time,channel,otherInfoDanger)
{
  if(telegram.active)
  {
    let chats = [];
    if(channel.telegram_chats)
    {
      chats = channel.telegram_chats.split(',');
    }
    let mytelegram = channel.telegram;
    let nameObject = channel.name_level_1;
    let room = channel.level_2;
    let name = channel.name;
    let message = channel.message_messenger;
    let message_admin = 'undefined';
    if(!message)
    {
      message = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
    }
    message_admin = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
    if(mytelegram)
    {
      if(chats.length>0)
      {
        for (let i = 0 ; i < chats.length; i++)
        {
          let chat = getValidChat(chats[i]);
          if(chat!==false)
          {
            telegram.pushMessage(message,chat,new Date().getTime());
          }
        }
      }
      if(config.debugMOD&&config.telegram_admin_chatId)
      {
        telegram.pushMessage(message_admin,config.telegram_admin_chatId,new Date().getTime());
      }
    }
  }
}
function sendSMTP(time,channel,otherInfoDanger)
{
  if(smtp.active)
  {
    let emails = [];
    if(channel.emails)
    {
      emails = channel.emails.split(',');
    }
    let mysmtp = channel.email;
    let nameObject = channel.name_level_1;
    let room = channel.level_2;
    let name = channel.name;
    let message = channel.message_messenger;
    let message_admin = 'undefined';
    if(!message)
    {
      message = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
    }
    message_admin = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
    if(mysmtp)
    {
      if(emails.length>0)
      {
        for (let i = 0 ; i < emails.length; i++)
        {
          let email = getValidEmail(emails[i]);
          if(email!==false)
          {
            smtp.pushMessage(message,email,new Date().getTime());
          }
        }
      }
      if(config.debugMOD&&config.smtp_user)
      {
        smtp.pushMessage(message_admin,config.smtp_user,new Date().getTime());
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
    let otherInfo = {
      timeServer:timeServerMs,
      timeDevice: undefined,
      reason: undefined,
      reasonText: undefined,
      num: undefined,
      value: undefined
    }
    if(dev.valid)
    {
      let dataDevice = new Parser(dev.type,data,port,dev.version);
      let currentDate = new Date().getTime();
      let lastDateSMS = dev.lastDateSMS;
      let validBetweenTime =  (dev.lastDateSMS===undefined||(currentDate-lastDateSMS)>config.devices_betweenTimeSMS);
      let validNumChannel = dataDevice.num_channel!==undefined;
      let numChannel = validNumChannel?parseInt(dataDevice.num_channel):1;

      otherInfo.timeDevice = dataDevice.time;

      validNumChannel = validNumChannel&&!isNaN(numChannel);
      if(validBetweenTime)
      {
        switch (dev.type)
        {
          case 1:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI11');
            if(validNumChannel)
            {
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel&&dataDevice.type_package==2)
              {
                dev.lastDateSMS = currentDate;
                let currentSensor = dataDevice['sensor_'+num_channel];
                otherInfo.reasonText = currentSensor == 1 ? 'Был замкнут вход' : 'Был разомкнут вход';
                otherInfo.num = num_channel;
                otherInfo.value = currentSensor;
                // reason = 'Был замкнут вход';
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 2:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI12');
            if(validNumChannel)
            {
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel&&dataDevice.type_package==2)
              {
                dev.lastDateSMS = currentDate;
                let currentSensor = dataDevice['sensor_'+num_channel];
                otherInfo.reasonText = currentSensor == 1 ? 'Был замкнут вход' : 'Был разомкнут вход';
                otherInfo.num = num_channel;
                otherInfo.value = currentSensor;
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }

          case 3:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI13');
            if(validNumChannel)
            {
              let originalNum = numChannel;
              numChannel = numChannel + 6;
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel&&dataDevice.type_package==2)
              {
                dev.lastDateSMS = currentDate;
                let currentSensor = dataDevice['sensor_'+num_channel];
                otherInfo.reasonText = currentSensor == 1 ? 'Был замкнут вход' : 'Был разомкнут вход';
                otherInfo.num = originalNum;
                otherInfo.value = currentSensor;
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 4:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device TD11');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel = dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if( validChannel )
            {
              if ( dev.version === 1 )
              {
                let checkEvent = dataDevice.reason!==0;
                let checkTemperature = dataDevice.limit_exceeded;
                otherInfo.value = dataDevice.temperature;
                otherInfo.reasonText = '';
                otherInfo.reason = dataDevice.reason;
                if ( checkEvent || checkTemperature )
                {
                  if(checkEvent)
                  {
                    otherInfo.reasonText += parseReason('td11', dev.version, reason, channel)+'. ';
                  }
                  if(checkTemperature && dataDevice.reason != 5 )
                  {
                    otherInfo.reasonText += 'Отклонение температуры. ';
                  }
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
              else if ( dev.version === 0 )
              {
                let checkEvent = dataDevice.reason!==0;
                let t = parseFloat(dataDevice.temperature);
                let t_max = channel.max_t;
                let t_min = channel.min_t;
                let checkTemperature = t<=t_min||t>=t_max;
                if(checkEvent||checkTemperature)
                {
                  if(checkEvent)
                  {
                    otherInfo.reasonText += parseReason('td11', dev.version, reason, channel)+'. ';
                  }
                  if(checkTemperature && dataDevice.reason != 5 )
                  {
                    otherInfo.reasonText += 'Отклонение температуры. ';
                  }
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
              else
              {
                if(config.debugMOD) console.log(moment().format('LLL')+': '+' An unknown version of the device device TD11');
              }
            }
            break;
          }
          case 5:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device TP11');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel && dataDevice.type_package == 1)
            {
              if ( dev.version === 1 )
              {
                let danger = dataDevice.reason != 0 && dataDevice.reason !=5;
                if ( danger )
                {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
              else if ( dev.version === 0 )
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
                    wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
              else
              {
                if(config.debugMOD) console.log(moment().format('LLL')+': '+' An unknown version of the device device TP11');
              }
            }
            break;
          }
          case 6:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MC');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel )
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 0;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 7:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device AS');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 0;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 8:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MS');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 0;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 9:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device СВЭ-1');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.state_display||dataDevice.leaking||dataDevice.breakthrough||dataDevice.hall_1;
              if (danger)
              {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 10:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SS ');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 0;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,dev.get_channel(1),obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 11:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI21');
            if(validNumChannel)
            {
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if ( validChannel && dataDevice.type_package==2 )
              {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 12:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device UE');
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let info = dataDevice.type_package==1;
              let validEvent = dataDevice.event !== undefined;
              let danger = info && validEvent && dataDevice.event != 1 && dataDevice.event != 19;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 13:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device GM-2 ');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason > 0;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 14:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device LM-1 ');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel = dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              if(dataDevice.alarm)
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 15:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device TD-11');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
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
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 17:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device GM-1 ');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason!=1;
              if(danger)
              {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 18:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI-22 ');
            if(validNumChannel)
            {
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel)
              {
                if ( dataDevice.type_package==2 )
                {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
            }
            break;
          }
          case 20:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MBUS-1 ');
            if(validNumChannel)
            {
              numChannel = numChannel + 10;
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel)
              {
                if ( dataDevice.type_package==5 )
                {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
            }
            break;
          }
          case 21:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MBUS-2 ');
            if(validNumChannel)
            {
              numChannel = numChannel + 10;
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel)
              {
                if ( dataDevice.type_package==5 )
                {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
            }
            break;
          }
          case 23:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device HS ');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason!=1;
              if(danger)
              {
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }

          case 24:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SPBZIP 2726/2727');
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.event !== undefined && dataDevice.event !== 1 && dataDevice.event !== 19;
              if ( dataDevice.type_package==1 && danger )
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 25:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device UM ');
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 1;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 26:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SRC ');
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 1;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
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
function telegramStarted()
{
  if(config.telegram_admin_chatId)
  {
    telegram.pushMessage('Successfully started IotVega Notifier',config.telegram_admin_chatId,new Date().getTime());
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
  if(smpp.employment||smsc.employment||telegram.employment||smtp.employment)
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
        cronTime: CRON_TIME,
        onTick: updating,
        start: true,
      });
    }
    try
    {
      initWS();
      smpp = new VegaSMPP(config.address_smpp,config.system_smpp,config.smpp_info,config.smpp,config.debugMOD);
      smsc = new SMSCru(config.smsc_auth,config.smsc,config.smsc_settings,config.debugMOD);
      telegram = new VegaTelegram(config.telegram_bot_token,config.telegram,config.telegram_proxy,config.debugMOD);
      smtp = new VegaSMTP(config.smtp,config.smtp_host,config.smtp_port,config.smtp_secure,config.smtp_user,config.smtp_password,config.debugMOD);
      smpp.on('free',free);
      smsc.on('free',free);
      telegram.on('free',free);
      smtp.on('free',free);
      telegram.on('telegramStarted',telegramStarted);
      Which('npm', function(error, path){ 
          if(error) console.log(moment().format('LLL')+': '+'[SYSTEM ERROR]',error);
          else npm = path;
      });
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
      spawn_update = spawn(npm, ['install']);
      spawn_update.stdout.on('data',(data)=>{
        if(config.debugMOD)  console.log(moment().format('LLL')+': '+data);
      });
      spawn_update.stderr.on('data',(data)=>{
        if(config.debugMOD)  console.log(moment().format('LLL')+': '+data);
      });
      spawn_update.on('close',(code)=>{
        if(code == 0)
        {
          console.log(moment().format('LLL')+': The IotVegaNotifier is reinstall success');
          waitingReboot = true;
          emergencyExit();
        }
        else
        {
          if(config.debugMOD)  console.log(moment().format('LLL')+': The IotVegaNotifier is reinstall close, code',code);
        }
      });
      spawn_update.on('error',(err)=>{
        console.log(moment().format('LLL')+': The IotVegaNotifier is reinstall error',err);
      });
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
