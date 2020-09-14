//vega_logger.js version 2.0.0 lite
const winston = require('winston');
const uuidv4 = require('uuid/v4');
let moment = require( 'moment' );
const Logger = winston.createLogger({
    format: winston.format.json(),
    transports:[
        new winston.transports.File({filename:'./logs/logs_notifier.log',timestamp:true,handleExceptions:true,maxsize:10485760,maxFiles:5,json:true})
    ]
});
console.log( moment().format('LLL')+': [LOGGER] '+'Started to write logs to the ./logs/logs_notifier.log');
Logger.log({
    level:'info',
    message:'Started to write logs to the ./logs/logs_notifier.log',
    module:'[LOGGER]',
    time:moment().format('LLL'),
    timestamp:parseInt(moment().format('x')),
    uuid:uuidv4(),
    time:moment().format('LLL'),
    timestamp:parseInt(moment().format('x')),
    uuid:uuidv4()
  });
module.exports = Logger;