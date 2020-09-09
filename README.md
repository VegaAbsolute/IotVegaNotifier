[![IotVega](http://iotvega.com/images/logo.png)](http://iotvega.com)
# IotVegaNotifierLite
Application to notify IotVegaServer users about an alarm event.
## Quick start
#### Preparation
- Install node.js 
[download](https://nodejs.org/en/download/)
or
`apt-get install nodejs` - Example for linux ubuntu
- Install npm
`apt-get install npm` - Example for linux ubuntu
- Install the Nodejs Application Task Manager PM2 `npm install pm2 -g`
- Install git (examle for ubuntu `apt-get install git`)
#### Installing and running the application
- Make a clone of the repository IotVegaNotifier `git clone https://github.com/VegaAbsolute/IotVegaNotifier.git -b lite`
- Go to the Applications folder IotVegaNotifier `cd IotVegaNotifier`
- Running the application `pm2 start npm -- start`
- Configure IotVegaNotifier. Edit the config.ini file.
- Restart the application so that the settings are applied `pm2 restart 0`
> To view the program work use the command `pm2 monit`
To exit the console, press CTRL+D

[Description http API rus](api.md)

## Support devices
- UE
- SVE
- GM-1
- GM-2
- SI-11
- SI-12
- SI-13
- SI-21
- SI-22
- TD-11
- TP-11
- LM-1
- TL-1
- SRC-1
- M-BUS-1
- M-BUS-2
- SMART HS-0101
- SMART MC-0101
- SMART AS-0101
- SMART MS-0101
- SMART SS-0101
- SMART UM-0101
- SPBZIP 2726/2727





