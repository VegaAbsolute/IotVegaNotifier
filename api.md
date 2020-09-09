# Описание API IotVega Notifier

## Web интерфейс
Веб интерфейс приложения доступен по адресу
[http://ip:port/](http://ip:port/)

ip, port - настраиваются в приложении, по умолчанию:
- ip=127.0.0.1
- port=4040

## Описание API

### Авторизация

***МЕТОД:*** POST

***URL:*** [http://ip:port/authorization](http://ip:port/authorization)

***ПАРАМЕТРЫ:***

> В формате JSON 
>

- login *- логин для доступа*
- password *- пароль*

***ОТВЕТ:***
```
{
  "cmd":"authorization",
  "status":true/false,
  "token": "ТОКЕН"
}
```

### Запрос файла с логами приложения

***МЕТОД:***  GET

***URL:*** [http://ip:port/downloadLogFile](http://ip:port/downloadLogFile)

***ПАРАМЕТРЫ:***

- token *- действующий токен*

### Запрос логов приложения

***МЕТОД:*** GET

***URL:*** [http://ip:port/downloadLogFile](http://ip:port/downloadLogFile)

***ПАРАМЕТРЫ:***

- token *- действующий токен*
- limit *- глубина чтения логов*

***ОТВЕТ:***
```
{
  "cmd":"getLogs",
  "status":true/false,
  "data":{
    //опциональный параметр, только в случае status = true
    //Массив логов
  }`,
  "error":"ошибка" //опциональный параметр, только в случае status = false
}
```
***ПРИМЕЧАНИЯ:***
- Параметр "error"="auth" - означает ошибку авторизации

### Запрос настроек

***МЕТОД:*** GET

***URL:*** [http://ip:port/currentSettings](http://ip:port/currentSettings)

***ПАРАМЕТРЫ:*** 

- token *- действующий токен*

***ОТВЕТ:***
```
{
  "cmd":"currentSettings",
  "status":true/false,
  "data":{ 
      //опциональный параметр, только в случае status = true
    //НАСТРОЙКИ
  },
  "error":"ошибка" //опциональный параметр, только в случае status = false
}
```
***ПРИМЕЧАНИЯ:***
- Параметр "error"="auth" - означает ошибку авторизации

### Изменение настроек

***МЕТОД:*** POST

***URL:*** [http://ip:port/saveSettings](http://ip:port/saveSettings)

***ПАРАМЕТРЫ:***

> В формате JSON 
>

- НАСТРОЙКИ

***ОТВЕТ:***
```
{
  "cmd":"saveSettings",
  "status":true/false,
  "error":"ошибка" //опциональный параметр, только в случае status = false
}
```
***ПРИМЕЧАНИЯ:***
- Параметр "error"="auth" - означает ошибку авторизации
- В настройках нужно предать токен авторизации, token

#### Описание структуры "Логи":
> Логи передаются как массив значение.

***Структура:***
- level *- Уровень лога*
- message *- Сообщение*
- module *- Модуль приложения*
- time *- Время в текстовом формате*
- timestamp *- timestamp*
- uuid *- уникальный идентификатор лога*

#### Описание структуры "Настройки":
>Структура настроек соответствует структуре config.ini

Например: 

*Настройки соединения c сервером будут выглядеть так:* 
```
_ws:{
  url:"ws://127.0.0.1:8001",
  login:"root",
  password:"123"
}
```

*Когда те же настройки в файле конфигурации выглядит так:*
```
[ws]
  #The address of the server WebSocket IotVega
url=ws://127.0.0.1:8001
  #The user of the server WebSocket IotVega
login=root
  #The user password
password=123
```
***Пример:***
```
{
    _ws:{...},
    _smtp:{...},
    _smpp:{...},
}
```
