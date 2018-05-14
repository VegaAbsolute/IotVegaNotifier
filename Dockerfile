FROM ubuntu:bionic
MAINTAINER Vega Absolute
RUN useradd -ms /bin/bash vega
WORKDIR /home/vega
RUN apt-get update && apt-get install -y git build-essential pkg-config scons libao-dev linphone-nogtk nodejs npm nano wget unzip
RUN apt-get autoremove -y
RUN npm install -g pm2
RUN wget https://github.com/Olga-Yakovleva/RHVoice/archive/master.zip && unzip master.zip && cd RHVoice-master && scons && scons install && ldconfig
USER vega
RUN git clone https://github.com/VegaAbsolute/IotVegaNotifier.git && cd IotVegaNotifier
CMD cd IotVegaNotifier && pm2 start npm -- start && pm2 monit
