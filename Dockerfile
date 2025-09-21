FROM node:20.11.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Используем nginx для раздачи статики
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Создаем простой конфиг nginx
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
