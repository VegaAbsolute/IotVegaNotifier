const winston = require('winston');
const uuidv4 = require('uuid/v4');
let moment = require( 'moment' );
// const { combine, timestamp, label, prettyPrint } = winston.format;
const Logger = winston.createLogger({
    // level:'info',
    format: winston.format.json(),
    // format: combine(timestamp(),prettyPrint()),
    // defaultMeta: { time:moment().format('LLL'), timestamp:parseInt(moment().format('x')), uuid:uuidv4() },
    transports:[
        // new winston.transports.Console({handleExceptions:true}),
        new winston.transports.File({filename:'./logs/logs_notifier.log',timestamp:true,handleExceptions:true,maxsize:10485760,maxFiles:5,json:true})
    ]
});
// if ( process.env.NODE_ENV !== 'production' )
// {
//     Logger.add(
//         new winston.transports.Console({
//             format: winston.format.simple()
//         })
//     );
// }
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