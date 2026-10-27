FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /tmp/dist
RUN find /tmp/dist -name "index.html" -exec dirname {} \; | xargs -I {} cp -r {}/. /usr/share/nginx/html/ && rm -rf /tmp/dist
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]