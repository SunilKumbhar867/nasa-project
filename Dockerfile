# Use a Windows-based Node.js image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for the server (* will inculde both package.json and package-lock.json)
COPY package*.json ./

# Copy the client/package.json for the client
COPY client/package*.json client/

# Install client dependencies
RUN npm run install-client --only=production

# Copy the server code
COPY server/package*.json server/

# Install client dependencies
RUN npm run install-server --only=production

# Copy the client code and build it
COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

# Set the user to run the application (optional)
USER node
CMD [ "npm", "start","--prefix","server" ] 

EXPOSE 8000
