# Stage 1: Build the React application using Vite
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the built files with a simple static file server
FROM node:20-alpine

WORKDIR /app

# Copy the build files from the previous stage
COPY --from=build /app/dist ./dist

# Install a lightweight static server to serve the build files
RUN npm install -g serve

# Expose port 3000 for the front end
EXPOSE 3000

# Command to serve the static files
CMD [ "serve", "-s", "dist" ]