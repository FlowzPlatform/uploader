FROM node:8.1.2
ADD . /usr/src/app/server

WORKDIR /usr/src/app/server

RUN npm install


EXPOSE 3040 4040

CMD NODE_ENV=production npm start
