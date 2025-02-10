# Use Node.js for building
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Set environment variables
ARG REACT_APP_API_URL_ROOT
ENV REACT_APP_API_URL_ROOT=${REACT_APP_API_URL_ROOT}

RUN npm run build

# Use Nginx for serving the build files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
