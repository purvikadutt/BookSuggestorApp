FROM node:12-alpine

WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm install

COPY src ./src
RUN npm run build

CMD ["node", "dist/server"]
EXPOSE 3000:3000
