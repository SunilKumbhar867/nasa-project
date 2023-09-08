# Use a Windows-based Node.js image
FROM mcr.microsoft.com/windows/servercore:ltsc2019

# Set the working directory inside the container
WORKDIR C:\app

# Copy package.json and package-lock.json for the server
COPY package*.json ./

# Install server dependencies
RUN npm install --only=production

# Copy the client/package.json for the client
COPY client/package.json client/

# Install client dependencies
RUN npm install --only=production --prefix client

# Copy the client code and build it
COPY client/ client/
RUN npm run build --prefix client

# Copy the server code
COPY server/ server/

# Set the user to run the application (optional)
USER ContainerUser

# Define the command to start the server
CMD [ "npm", "start", "--prefix", "server" ]

# Expose the port your application listens on (if needed)
EXPOSE 8000
