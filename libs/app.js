
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
function generationMessageNotifier(channel,info,type)
{
  let message = ''
    , reason = ''
    , nameObject = ''
    , room = ''
    , name = ''
    , model = ''
    , fcnt = '';
  if( !isEmptyText( channel.name_level_1 ) ) nameObject = `Объект: ${channel.name_level_1};`;
  if( !isEmptyText( channel.level_2 ) ) room = `Помещение: ${channel.level_2};`;
  if( !isEmptyText( channel.name ) ) name = `Устройство: ${channel.name};`;
  if( !isEmptyText( info.reasonText ) ) reason = `Причина: ${info.reasonText}`;
  if( !isEmptyText( info.fcnt ) ) fcnt = `№ пакета: ${info.fcnt};`;
  if( !isEmptyText( info.model ) ) model = `Модель устройства: ${info.model};`;
  if(type == 'sms')
  {
    message = `Тревога! ${nameObject} ${room} ${name} ${reason}`;
  }
  else
  { 
    message = `Внимание!\r\nПроизошло тревожное событие!\r\n${nameObject}\r\n${room}\r\n${model}\r\n${name}\r\n${fcnt}\r\n${reason}`;
  }
  return message;
}
//Функция расшифровки причины
function parseReason(typeDev,version,reason,channel)
{
  reason = parseInt(reason);
  if ( typeDev == 'td11' )
  {
    if ( reason === 0 || reason === '0' ) return 'По времени';
    else if ( reason === 1 ) return channel.security_name;
    else if ( reason === 2 ) return 'Вскрытие';
    else if ( reason === 3 ) return channel.hall_1_name;
    else if ( reason === 4 ) return channel.hall_2_name;
    if ( version >= 1 )
    {
      if ( reason == 5 ) return 'Отклонение температуры';
    }
  }
  else if ( typeDev == 'tp11' )
  {
    if ( reason === 0 || reason === '0' ) return 'По времени';
    else if ( reason === 1 ) return channel.security_name;
    else if ( reason === 2 ) return channel.security_name_2;
    else if ( reason === 3 ) return 'Изменилось состояние питания';
    
    if ( version >= 1 )
    {
      if ( reason === 4 ) return 'Отклонение показаний';
      else if ( reason === 5 ) return 'По запросу';
    }
  }
  else if ( typeDev == 'mc0101' )
  {
    if ( reason === 0 || reason === '0' ) return 'По времени';
    else if ( reason === 1 ) return channel.instrument;
    else if ( reason === 2 ) return channel.instrument2;
  }
  else if ( typeDev == 'as0101' )
  {
    if ( reason === 0 || reason === '0' ) return 'По времени';
    else if ( reason === 1 ) return 'Сработал датчик движения';
  }
  else if ( typeDev == 'ms0101' )
  {
    if ( reason === 0 || reason === '0' ) return 'По времени';
    else if ( reason === 1 ) return 'По тревоге';
    else if ( reason === 2 ) return 'Постановка в охрану';
  }
  else if ( typeDev == 'ss0101' )
  {
    if ( reason === 0 || reason === '0' ) return 'По времени';
    else if ( reason === 1 ) return 'Задымление';
  }
  else if ( typeDev == 'ue' )
  {
    if ( reason === 1 ) return 'По времени';
    else if ( reason === 2 ) return 'Вскрытие клеммной крышки';
    else if ( reason === 3 ) return 'Вскрытие корпуса';
    else if ( reason === 4 ) return 'Магнитное воздействие';
    else if ( reason === 5 ) return 'Потеря фазы';
    else if ( reason === 6 ) return 'Инверсия фазы';
    else if ( reason === 7 ) return 'Сработало реле ограничения';
    else if ( reason === 8 ) return 'Превышение напряжения по фазе А';
    else if ( reason === 9 ) return 'Превышение напряжения по фазе В';
    else if ( reason === 10 ) return 'Превышение напряжения по фазе С';
    else if ( reason === 11 ) return 'Превышение лимита мощности';
    else if ( reason === 12 ) return 'Превышение лимита активной мощности';
    else if ( reason === 13 ) return 'Превышение лимита энергии по тарифу 1';
    else if ( reason === 14 ) return 'Превышение лимита энергии по тарифу 2';
    else if ( reason === 15 ) return 'Превышение лимита энергии по тарифу 3';
    else if ( reason === 16 ) return 'Превышение лимита энергии по тарифу 4';
    else if ( reason === 17 ) return 'Разряд встроенной батареи';
    else if ( reason === 18 ) return 'Отключение электропитания электросчетчика';
    else if ( reason === 19 ) return 'По запросу';
    else if ( reason === 20 ) return 'Включение электропитания электросчетчика';
  }
  else if ( typeDev == 'gm2' )
  {
    if ( reason === 0 || reason === '0' ) return 'По времени';
    else if ( reason === 1 ) return 'По тревоге ' + channel.name_sensor_in_1;
    else if ( reason === 2 ) return 'По тревоге ' + channel.name_sensor_in_2;
    else if ( reason === 3 ) return 'Изменение состояния ' + channel.name_sensor_out_1;
    else if ( reason === 4 ) return 'Изменение состояния ' + channel.name_sensor_out_2;
    else if ( reason === 5 ) return 'Магнитное воздействие';
    else if ( reason === 6 ) return 'Вскрытие корпуса';
  }
  if ( typeDev == 'gm1' )
  {
    if ( reason === 1 ) return 'По времени';
    else if ( reason === 2 ) return 'Магнитное воздействие';
    else if ( reason === 3 ) return 'Электронный блок не отвечает';
    else if ( reason === 4 ) return 'Перезагрузка электронного блока';
  }
  else if ( typeDev == 'hs0101' )
  {
    if ( reason === 1 ) return 'По времени';
    else if ( reason === 2 ) return 'По тревоге ' + channel.security_name;
    else if ( reason === 3 ) return 'По тревоге ' + channel.security_name_2;
    else if ( reason === 4 ) return 'По акселерометру ';
    else if ( reason === 5 ) return 'Отклонение влажности';
    else if ( reason === 6 ) return 'Отклонение температуры';
  }
  else if ( typeDev == 'spbzip' )
  {
    if ( reason === 1 ) return 'По времени';
    else if ( reason === 2 ) return 'Вскрытие клеммной крышки';
    else if ( reason === 3 ) return 'Вскрытие корпуса';
    else if ( reason === 7 ) return 'Сработало реле ограничения';
    else if ( reason === 8 ) return 'Превышение напряжения по фазе(ам)';
    else if ( reason === 11 ) return 'Превышение лимита мощности';
    else if ( reason === 18 ) return 'Отключение электропитания электросчетчика';
    else if ( reason === 19 ) return 'По запросу';
    else if ( reason === 20 ) return 'Включение электропитания электросчетчика';
    else if ( reason === 21 ) return 'Провал напряжения по фазе(ам)';
    else if ( reason === 24 ) return 'Отклонение частоты';
  }
  else if ( typeDev == 'um0101' )
  {
    if ( reason === 1 ) return 'По времени';
    else if ( reason === 2 ) return 'Отклонение CO2';
    else if ( reason === 3 ) return 'Отклонение освещенности';
    else if ( reason === 4 ) return 'По акселерометру ';
    else if ( reason === 5 ) return 'Отклонение влажности';
    else if ( reason === 6 ) return 'Отклонение температуры';
    else if ( reason === 7 ) return 'Отклонение шума';
    else if ( reason === 8 ) return 'Снятие';
  }
  else if ( typeDev == 'srs1' )
  {
    if ( reason === 1 ) return 'По времени';
    else if ( reason === 2 ) return 'Отклонение напряжения';
    else if ( reason === 3 ) return 'Изменение состояния входного напряжения';
    else if ( reason === 5 ) return 'Вскрытие корпуса';
    else if ( reason === 6 ) return 'Движение';
    else if ( reason === 7 ) return 'Отклонение угла отклонения';
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
  let message = channel.voice_message;
  let message_admin = generationMessageNotifier(channel,otherInfoDanger);
  //Отправлять сообщение формата приложения.
  let sendMessageApp  = channel.app_message_danger === true;
  //Отправлять сообщение формата пользователя.
  let sendMessageUser = channel.user_message_danger === true || channel.user_message_danger === undefined ;
  if(isEmptyText(message_admin)) message_admin = 'Тревога! IotVegaNotifier.';
  if(channel.telephones)
  {
    telephones = channel.telephones.split(',');
  }
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
            if( sendMessageApp && sendMessageUser && !isEmptyText(message) )
            {
              smsc.pushVoiceMessage(`${message_admin}\r\nПользовательское сообщение: ${message}`,telephone,new Date().getTime());
            }
            else if ( sendMessageApp ) 
            {
              smsc.pushVoiceMessage(message_admin,telephone,new Date().getTime());
            }
            else if ( sendMessageUser && !isEmptyText(message) ) 
            {
              smsc.pushVoiceMessage(message,telephone,new Date().getTime());
            }
            else if ( isEmptyText(message) )
            {
              smsc.pushVoiceMessage(message_admin,telephone,new Date().getTime());
            }
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
    let message = channel.message_sms;
    let message_admin = generationMessageNotifier(channel,otherInfoDanger,'sms');
    //Отправлять сообщение формата приложения.
    let sendMessageApp  = channel.app_message_danger === true;
    //Отправлять сообщение формата пользователя.
    let sendMessageUser = channel.user_message_danger === true || channel.user_message_danger === undefined ;

    if(isEmptyText(message_admin)) message_admin = 'Тревога! IotVegaNotifier.';
    if(channel.telephones)
    {
      telephones = channel.telephones.split(',');
    }
    if(sms)
    {
      if(telephones.length>0)
      {
        for (let i = 0 ; i < telephones.length; i++)
        {
          let telephone = getValidTelephone(telephones[i]);
          if(telephone!==false)
          {
            let countSendMessage = 0;
            if ( sendMessageApp ) 
            {
              smpp.pushSMS(message_admin,telephone,new Date().getTime());
              countSendMessage++;
            }
            if ( sendMessageUser && !isEmptyText(message) ) 
            {
              smpp.pushSMS(message,telephone,new Date().getTime());
              countSendMessage++;
            }
            // В случае если не удалось отправить на отправку ни одного сообщения, отправляем сообщение формата приложения 
            if ( countSendMessage === 0 || isEmptyText(message) )
            {
              smpp.pushSMS(message_admin,telephone,new Date().getTime());
            }
          }
        }
      }
      if(config.debugMOD&&config.telephoneAdministrator)
      {
        smpp.pushSMS(message_admin,config.telephoneAdministrator,new Date().getTime());
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
    let message = channel.message_messenger;
    let message_admin = generationMessageNotifier(channel,otherInfoDanger);
    //Отправлять сообщение формата приложения.
    let sendMessageApp  = channel.app_message_danger === true;
    //Отправлять сообщение формата пользователя.
    let sendMessageUser = channel.user_message_danger === true || channel.user_message_danger === undefined ;
    if(!message)
    {
      message = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
    }
    message_admin = 'Внимание! На объекте ' + nameObject+', в помещении '+room+' произошла тревога датчика '+name;
    if(isEmptyText(message_admin)) message_admin = 'Тревога! IotVegaNotifier.';
    if(mytelegram)
    {
      if(chats.length>0)
      {
        for (let i = 0 ; i < chats.length; i++)
        {
          let chat = getValidChat(chats[i]);
          if(chat!==false)
          {
            if( sendMessageApp && sendMessageUser && !isEmptyText(message) )
            {
              telegram.pushMessage(`${message_admin}\r\nПользовательское сообщение: ${message}`,chat,new Date().getTime());
            }
            else if ( sendMessageApp ) 
            {
              telegram.pushMessage(message_admin,chat,new Date().getTime());
            }
            else if ( sendMessageUser && !isEmptyText(message) ) 
            {
              telegram.pushMessage(message,chat,new Date().getTime());
            }
            else if ( isEmptyText(message) )
            {
              telegram.pushMessage(message_admin,chat,new Date().getTime());
            }
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

    let message = channel.message_messenger;
    let message_admin = generationMessageNotifier(channel,otherInfoDanger);
    //Отправлять сообщение формата приложения.
    let sendMessageApp  = channel.app_message_danger === true;
    //Отправлять сообщение формата пользователя.
    let sendMessageUser = channel.user_message_danger === true || channel.user_message_danger === undefined ;
    
    if(isEmptyText(message_admin)) message_admin = 'Тревога! IotVegaNotifier.';
    if(mysmtp)
    {
      if(emails.length>0)
      {
        for (let i = 0 ; i < emails.length; i++)
        {
          let email = getValidEmail(emails[i]);
          if(email!==false)
          {
            if( sendMessageApp && sendMessageUser && !isEmptyText(message) )
            {
              smtp.pushMessage(`${message_admin}\r\nПользовательское сообщение: ${message}`,email,new Date().getTime());
            }
            else if ( sendMessageApp ) 
            {
              smtp.pushMessage(message_admin,email,new Date().getTime());
            }
            if ( sendMessageUser && !isEmptyText(message) ) 
            {
              smtp.pushMessage(message,email,new Date().getTime());
            } 
            if ( isEmptyText(message) )
            {
              smtp.pushMessage(message_admin,email,new Date().getTime());
            }
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
      value: undefined,
      unit: undefined,
      fcnt: undefined
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
      otherInfo.fcnt = obj.fcnt;

      validNumChannel = validNumChannel&&!isNaN(numChannel);
      if(validBetweenTime)
      {
        switch (dev.type)
        {
          case 1:
          {
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI11');
            otherInfo.model = 'SI-11';
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
            otherInfo.model = 'SI-12';
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
            otherInfo.model = 'SI-13';
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
            otherInfo.model = 'TD-11';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device TD11');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel = dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if( validChannel )
            {
              otherInfo.value = dataDevice.temperature;
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.reason;
              otherInfo.unit = 'градусов';
              if ( dev.version >= 1 )
              {
                let checkEvent = dataDevice.reason!==0;
                let checkTemperature = dataDevice.limit_exceeded;
                if ( checkEvent || checkTemperature )
                {
                  if(checkEvent)
                  {
                    otherInfo.reasonText += parseReason('td11', dev.version, otherInfo.reason, channel)+'. ';
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
                    otherInfo.reasonText += parseReason('td11', dev.version, otherInfo.reason, channel)+'. ';
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
            otherInfo.model = 'TP-11';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device TP11');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel && dataDevice.type_package == 1)
            {
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.reason;
              otherInfo.unit = channel.unit;
              if ( dev.version >= 1 )
              {
                let danger = dataDevice.reason != 0 && dataDevice.reason !=5;
                if ( danger )
                {
                  dev.lastDateSMS = currentDate;
                  otherInfo.reasonText += parseReason('tp11', dev.version, otherInfo.reason, channel)+'. ';
                  let s = parseFloat(dataDevice.sensorTP);
                  let min_v = parseFloat(channel.min_v);
                  let max_v = parseFloat(channel.max_v);
                  let newvalue = min_v+(((max_v-min_v)*(s-4))/16);
                  if(typeof newvalue === 'number' && !isNaN(newvalue) ) otherInfo.value = newvalue;
                  

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
                        if( typeof newvalue === 'number' && !isNaN(newvalue) )
                        {
                          otherInfo.value = newvalue;
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
                    otherInfo.reasonText += parseReason('tp11', dev.version, otherInfo.reason, channel)+'. ';
                    if ( sensorEvent ) otherInfo.reasonText += 'Отклонение показаний. ';
                    if ( dangerEvent && dataDevice.sensor_danger_1 ) otherInfo.reasonText += channel.security_name+'. ';
                    if ( dangerEvent && dataDevice.sensor_danger_2 ) otherInfo.reasonText += channel.security_name_2+'. ';
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
            otherInfo.model = 'MC-0101';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MC');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel )
            {
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.reason;
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 0;
              if ( danger )
              {
                otherInfo.reasonText += parseReason('mc0101', dev.version, otherInfo.reason, channel)+'. ';
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 7:
          {
            otherInfo.model = 'AS-0101';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device AS');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.reason;
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 0;
              if ( danger )
              {
                  otherInfo.reasonText += parseReason('as0101', dev.version, otherInfo.reason, channel)+'. ';
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 8:
          {
            otherInfo.model = 'MS-0101';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MS');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.reason;
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 0;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  otherInfo.reasonText += parseReason('ms0101', dev.version, otherInfo.reason, channel)+'. ';
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 9:
          {
            otherInfo.model = 'Водосчетчик';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device СВЭ-1');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.state_display||dataDevice.leaking||dataDevice.breakthrough||dataDevice.hall_1;
              if (danger)
              {
                otherInfo.unit = 'м³';
                otherInfo.value = dataDevice.sensorKB;
                otherInfo.reasonText = '';
                if ( dataDevice.state_display ) otherInfo.reasonText += 'Экран заблокирован. ';
                if ( dataDevice.leaking ) otherInfo.reasonText += 'Утечка. ';
                if ( dataDevice.breakthrough ) otherInfo.reasonText += 'Прорыв. ';
                if ( dataDevice.hall_1 ) otherInfo.reasonText += 'Магнитное воздействие. ';
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 10:
          {
            otherInfo.model = 'SS-0101';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SS ');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.reason;
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 0;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  otherInfo.reasonText += parseReason('ss0101', dev.version, otherInfo.reason, channel)+'. ';
                  wasAlarm(timeServerMs,dev.get_channel(1),obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 11:
          {
            otherInfo.model = 'SI-21';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SI21');
            if(validNumChannel)
            {
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if ( validChannel && dataDevice.type_package==2 )
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
          case 12:
          {
            otherInfo.model = 'Электросчетчик';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device UE');
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let info = dataDevice.type_package==1;
              let validEvent = dataDevice.event !== undefined;
              let danger = info && validEvent && dataDevice.event != 1 && dataDevice.event != 19;
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.event;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  otherInfo.unit = 'кВт⋅ч';
                  otherInfo.value = dataDevice.sensor_rate_sum;
                  otherInfo.reasonText += parseReason('ue', dev.version, dataDevice.event, channel)+'. ';
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 13:
          {
            otherInfo.model = 'GM-2';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device GM-2 ');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason > 0;
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.event;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  otherInfo.unit = 'м³';
                  otherInfo.value = dataDevice.sensor_rate_sum;
                  otherInfo.reasonText += parseReason('gm2', dev.version, dataDevice.reason, channel)+'. ';
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 14:
          {
            otherInfo.model = 'LM-1';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device LM-1 ');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel = dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              otherInfo.reasonText = '';
              if(dataDevice.alarm)
              {
                  otherInfo.reasonText = 'Тревога. ';
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 15:
          {
            otherInfo.model = 'TL-11';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device TL-11');
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
                if ( checkEvent ) otherInfo.reasonText += 'Вскрытие корпуса. ';
                if ( checkTemperature ) otherInfo.reasonText += 'Отклонение температуры 1 ('+dataDevice.temperature+'℃). ';
                if ( checkTemperature_2 ) otherInfo.reasonText += 'Отклонение температуры 2 ('+dataDevice.temperature_2+'℃). ';
                dev.lastDateSMS = currentDate;
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 17:
          {
            otherInfo.model = 'GM-1';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device GM-1 ');
            if( port !== 2 ) return;
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason!=1;
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.reason;
              otherInfo.value = dataDevice.sensor_rate_sum;
              otherInfo.unit = 'м³';
              if(danger)
              {
                
                dev.lastDateSMS = currentDate;
                otherInfo.reasonText += parseReason('gm2', dev.version, dataDevice.reason, channel)+'. ';
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 18:
          {
            otherInfo.model = 'SI-22';
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
                  let currentSensor = dataDevice['sensor_'+num_channel];
                  otherInfo.reasonText = currentSensor == 1 ? 'Был замкнут вход' : 'Был разомкнут вход';
                  otherInfo.num = num_channel;
                  otherInfo.value = currentSensor;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
            }
            break;
          }
          case 20:
          {
            otherInfo.model = 'M-BUS-1';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MBUS-1 ');
            if(validNumChannel)
            {
              let originalNum = numChannel;
              numChannel = numChannel + 10;
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel)
              {
                if ( dataDevice.type_package==5 )
                {
                  let currentSensor = dataDevice['sensor_'+num_channel];
                  otherInfo.reasonText = currentSensor == 1 ? 'Был замкнут вход' : 'Был разомкнут вход';
                  otherInfo.num = originalNum;
                  otherInfo.value = currentSensor;
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
            }
            break;
          }
          case 21:
          {
            otherInfo.model = 'M-BUS-2';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device MBUS-2 ');
            if(validNumChannel)
            {
              let originalNum = numChannel;
              numChannel = numChannel + 10;
              let channel = dev.get_channel(numChannel);
              let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
              if(validChannel)
              {
                if ( dataDevice.type_package==5 )
                {
                  let currentSensor = dataDevice['sensor_'+num_channel];
                  otherInfo.reasonText = currentSensor == 1 ? 'Был замкнут вход' : 'Был разомкнут вход';
                  otherInfo.num = originalNum;
                  otherInfo.value = currentSensor;
                  dev.lastDateSMS = currentDate;
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
                }
              }
            }
            break;
          }
          case 23:
          {
            otherInfo.model = 'HS-0101';
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
                otherInfo.reasonText = '';
                otherInfo.reason = dataDevice.reason;
                otherInfo.reasonText += parseReason('hs0101', dev.version, otherInfo.reason, channel)+'. ';
                wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }

          case 24:
          {
            otherInfo.model = 'SPBZIP 2726/2727';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SPBZIP 2726/2727');
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            otherInfo.reasonText = '';
            otherInfo.reason = dataDevice.event;
            if(validChannel)
            {
              let danger = dataDevice.event !== undefined && dataDevice.event !== 1 && dataDevice.event !== 19;
              if ( dataDevice.type_package==1 && danger )
              {
                  dev.lastDateSMS = currentDate;
                  otherInfo.unit = 'кВт⋅ч';
                  otherInfo.value = dataDevice.sensor_rate_sum;
                  otherInfo.reasonText += parseReason('spbzip', dev.version, dataDevice.event, channel)+'. ';
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 25:
          {
            otherInfo.model = 'UM-0101';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device UM ');
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 1;
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.reason;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  otherInfo.reasonText += parseReason('um0101', dev.version, otherInfo.reason, channel)+'. ';
                  wasAlarm(timeServerMs,channel,obj.fcnt,devEui,otherInfo);
              }
            }
            break;
          }
          case 26:
          {
            otherInfo.model = 'SRC-1';
            if(config.debugMOD) console.log(moment().format('LLL')+': '+'data from device SRC ');
            let channel = dev.get_channel(1);
            let validChannel =dataDevice.isObject(channel)&&channel.num_channel!==undefined&&channel.name!==undefined;
            if(validChannel)
            {
              let danger = dataDevice.reason !== undefined && dataDevice.reason !== 1;
              otherInfo.reasonText = '';
              otherInfo.reason = dataDevice.reason;
              if ( danger )
              {
                  dev.lastDateSMS = currentDate;
                  otherInfo.reasonText += parseReason('srs1', dev.version, otherInfo.reason, channel)+'. ';
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
