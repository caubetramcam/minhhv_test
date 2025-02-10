# Use Node.js base image
FROM node:20 as builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source files and build the app
COPY . .
RUN npm run build

# Use a lightweight image for the final container
FROM node:20

WORKDIR /usr/src/app

# Copy only built files and production dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./

# Expose the app port
EXPOSE ${PORT}

# Run the application in production mode
CMD ["npm", "run", "start:prod"]
