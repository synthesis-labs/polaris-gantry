FROM node:8

# Install docker
RUN curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh    

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]