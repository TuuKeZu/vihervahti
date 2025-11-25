FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm run install && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 8008

CMD ["node", "bin/index.js"]


