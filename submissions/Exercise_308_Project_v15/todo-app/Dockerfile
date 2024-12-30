FROM node:20-alpine as build-frontend

WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

COPY frontend/ .

RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

COPY --from=build-frontend /app/frontend/build ./build

COPY backend/ .

EXPOSE 3000

CMD ["node", "index.js"]
