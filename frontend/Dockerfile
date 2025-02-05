FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env .
COPY . .

EXPOSE 9000

RUN npm run build

CMD ["npm", "run", "start"]
