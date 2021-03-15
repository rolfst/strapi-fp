#######################################################
# Step 1: Building in the build container

# setup the OS
FROM node:12.10.0-alpine AS builder

# create destination directory
RUN mkdir -p /opt/webapps/open-challenge-platform
WORKDIR /opt/webapps/open-challenge-platform

# update and install dependency
RUN apk update && apk upgrade && apk add git

# copy the app, note .dockerignore
COPY . .
RUN npm install && npm run build

# build necessary, even if no static files are needed,
# since it builds the server as well


#########################################################
# Step 2: Deployment in the deployment container

# setup the OS
FROM node:12.10.0-alpine as app

# setup environment variables
ENV NODE_ENV=production
RUN mkdir -p /opt/webapps/open-challenge-platform && chown node:node /opt/webapps/open-challenge-platform
WORKDIR /opt/webapps/open-challenge-platform

# do now run as root user
USER node

# Install deps for production only
COPY ./package* ./
RUN npm install && \
    npm cache clean --force

# Copy built source from the upper builder stage
COPY --from=builder /opt/webapps/open-challenge-platform$PROD_ENV .$PROD_ENV
#COPY --from=builder /opt/webapps/open-challenge-platform/node_modules ./

# expose 5000 on container
ARG PORT=5000
ENV PORT $PORT
EXPOSE $PORT

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=5000
WORKDIR /opt/webapps/open-challenge-platform

