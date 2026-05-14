FROM node:latest

WORKDIR /usr/src

COPY package.json ./

RUN npm install

WORKDIR /usr/src/app
COPY ResourceManager .

#EXPOSE 3000
#CMD ["node","index.js"]
CMD ["node", "../node_modules/nodemon/bin/nodemon.js", "index.js"]