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
