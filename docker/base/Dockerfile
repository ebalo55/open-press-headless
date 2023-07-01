FROM node:alpine
LABEL authors="overridesoft"
LABEL description="Aetheria Headless Server - Base image"

WORKDIR /aetheria

COPY package.json .
COPY aetheria.default.json aetheria.json
COPY dist .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["node", "main.js"]
