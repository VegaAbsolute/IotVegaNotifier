const app = require('./libs/app.js');
const Config = require('./libs/config.js');
const fs = require('fs');
const ini = require('ini');
const pjson = require('./package.json');
const logger = require('./libs/vega_logger.js');
let moment = require( 'moment' );

let config = new Config();
let myConfig = {};
let path = './config.ini';
let homeDir = __dirname;
logger.log({
  level:'info',
  message:'IoTVega Notifier Lite v' + pjson.version + ' launched!',
  module:'[INITIALIZATION]'
});
console.log('IoTVega Notifier Lite v'+pjson.version, ' launched!')
if(!fs.existsSync(path))
{
  console.error( moment().format('LLL') + ':'+' Error accessing config.ini file');
  logger.log({
    level:'error',
    message:'Error accessing config.ini file',
    module:'[INITIALIZATION]'
  });
  process.exit(0);
}
else
{
  try
  {
    myConfig = ini.parse(fs.readFileSync(path, 'utf-8'));
  }
  catch (e)
  {
    logger.log({
      level:'error',
      message:'Config.ini file is not in the correct format, check that the data is correctly populated',
      module:'[INITIALIZATION]'
    });
    console.error(moment().format('LLL') + ':'+' Config.ini file is not in the correct format, check that the data is correctly populated',e);
    process.exit(0);
  }
  finally
  {
    let resultSetSettings = config.setFromConfig(myConfig);
    if(!resultSetSettings)
    {
      logger.log({
        level:'error',
        message:'Some config.ini parameters were not correctly populated!',
        module:'[INITIALIZATION]'
      });
      console.error(moment().format('LLL') + ':'+' Some config.ini parameters were not correctly populated!');
      process.exit(0);
    }
    else
    {
      app.run(config,homeDir);
    }
  }
}
