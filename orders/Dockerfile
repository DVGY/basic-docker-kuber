FROM node:alpine
ENV CI=true

WORKDIR /app
COPY package.json .
#skips dev dependency
RUN npm install --only=prod 
COPY . .

CMD ["npm","start"]