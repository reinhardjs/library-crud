FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env .
COPY . .

RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "start"]
