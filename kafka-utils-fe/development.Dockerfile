FROM node:lts

RUN mkdir /home/app

WORKDIR /home/app

RUN npm install -g @angular/cli

COPY ./kafka-utils-fe/package.json ./

RUN npm install

COPY ./kafka-utils-fe .

CMD ["ng", "serve", "--host", "0.0.0.0"]
