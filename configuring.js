const fs = require('fs');
const ini = require('ini');
const copyFile = require('fs-copy-file');
const logger = require('./libs/vega_logger.js');
const uuidv4 = require('uuid/v4');
let moment = require( 'moment' );
function refreshConfig()
{
  try
  {
    copyFile('./default.config', './config.ini', (err) => {
        if (err)
        {
          console.log('error',err);
          logger.log({
            level:'error',
            message:'ERROR 1',
            module:'[CONFIGURING]',
            time:moment().format('LLL'),
            timestamp:parseInt(moment().format('x')),
            uuid:uuidv4()
          });
        }
    });
  }
  catch (e)
  {
    logger.log({
      level:'error',
      message:'ERROR 2',
      module:'[CONFIGURING]',
      time:moment().format('LLL'),
      timestamp:parseInt(moment().format('x')),
      uuid:uuidv4()
    });
    console.error(e)
  }
}
if(!fs.existsSync('./config.ini'))
{
  refreshConfig();
}
else if(process.argv[2]=='refresh')
{
  try
  {
    fs.unlinkSync('./config.ini');
  }
  catch (e)
  {
    logger.log({
      level:'error',
      message:'ERROR 3',
      module:'[CONFIGURING]',
      time:moment().format('LLL'),
      timestamp:parseInt(moment().format('x')),
      uuid:uuidv4()
    });
    console.error(e)
  }
  finally
  {
    refreshConfig();
  }  
}
