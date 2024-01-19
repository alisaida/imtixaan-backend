#  official Node.js image 
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the application to the /app directory and install dependencies
COPY package.json /usr/src/app/
RUN npm install

# Set build arguments
ARG TEST_ARG
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD
ARG DB_URI

# Set environment variables
ENV DB_NAME=$DB_NAME \
    DB_USER=$DB_USER \
    DB_PASSWORD=$DB_PASSWORD \
    DB_URI=$DB_URI

# Copy the rest of the application
COPY . /usr/src/app

# Expose port to the outside once the container has launched
EXPOSE 4000

# Default command
CMD ["npm", "start"]