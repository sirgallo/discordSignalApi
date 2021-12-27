FROM node:lts-alpine

WORKDIR /usr/src/discordsignalsapi
COPY . ./

RUN apk --no-cache add curl
RUN npm install
RUN npm run build

EXPOSE 8008

CMD ["node", "./dist/startService.js"]