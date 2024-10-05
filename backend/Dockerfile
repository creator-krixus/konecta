FROM node:20.17.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 7000
CMD ["npm", "run", "dev"]

# Comandos para correr el docker
# docker build -t backend/konecta .
# docker run --name back-konecta -p 7000:7000 backend/konecta

