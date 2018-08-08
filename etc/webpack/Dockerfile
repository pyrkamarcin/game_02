FROM yarnpkg/node-yarn:latest

RUN apt-get update
RUN apt-get install yarn -y --force-yes

RUN npm install npm@latest -g

RUN usermod -o -u 1000 www-data
WORKDIR /var/www/html