# IotVegaNotifier
Application to notify IotVegaServer users about an alarm event.
## Quick start
1. Install the docker.io

- `sudo apt-get install docker.io`

- `sudo usermod -aG docker YourUser`

- `newgrp docker`

2. Run Docker IotVegaNotifier `docker run -it -d -p 5060:5060 --restart=always --name iotveganotifier vegaabsolute/iotveganotifier`

3. Configure IotVegaNotifier

- Open the console `docker exec -it iotveganotifier bash`

- Go to the folder with the application `cd IotVegaNotifier`

- Open the application configuration file for editing. `nano config.ini`

- Restart the application  IotVegaNotifier `pm2 restart 0`

To exit the console, press CTRL+B

## Self-build docker

1. Install the docker.io

- `sudo apt-get install docker.io`

- `sudo usermod -aG docker YourUser`

- `newgrp docker`

2. Make git clone IotVegaNotifier application `git clone https://github.com/VegaAbsolute/IotVegaNotifier.git`
3. Go to the folder with the application `cd IotVegaNotifier`
4. Build `docker build -t ivn .`
5. Run Docker IotVegaNotifier `docker run -it -d -p 5060:5060 --restart=always --name iotveganotifier ivn:latest`
6. Configure IotVegaNotifier

- Open the console `docker exec -it iotveganotifier bash`

- Go to the folder with the application `cd IotVegaNotifier`

- Open the application configuration file for editing. `nano config.ini`

- Restart the application  IotVegaNotifier `pm2 restart 0`

To exit the console, press CTRL+B
