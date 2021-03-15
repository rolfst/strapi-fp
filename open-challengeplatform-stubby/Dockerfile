# ---- Base Node ----
FROM node:12.10.0-stretch AS base
# Create app directory
WORKDIR /opt/app

# ---- Dependencies ----
FROM base AS dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# install app dependencies including 'devDependencies'
RUN npm install


# ---- Copy Files/Build ----
FROM dependencies AS build
WORKDIR /opt/app
COPY . /opt/app
# Build react/vue/angular bundle static files
# RUN npm run build

# ---- build libs we don't want to polute the release with compilers -----
FROM node:12.10.0-stretch AS releasebuild
# Create app directory
# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/app && chown node:node /opt/app
WORKDIR /opt/app

COPY --from=build /opt/app/package*.json ./
# Install app dependencies
RUN rm -rf package-lock.json node_modules \
#    && apt-get update && apt-get install .build-deps \
#    build-base \
#    libtool \
#    nasm \
#    zlib-dev \
#    curl \
#    g++ \
#    gcc \
#    gnupg \
#    autoconf \
#    automake \
#    libgcc \
#    make \
#    alpine-sdk \
#    bash \
#    lcms2-dev \
#    libpng-dev \
#    python \
    && npm install --no-optional && npm cache clean --force


# --- Release with Alpine ----
FROM node:12.10.0-stretch-slim AS release

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=5005
ENV PORT $PORT
EXPOSE $PORT

# Create app directory
# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/app && chown node:node /opt/app
WORKDIR /opt/app

# optional
# RUN npm -g install serve
USER node
COPY --from=releasebuild /opt/app/package*.json ./
# Install app dependencies
COPY --from=build /opt/app ./
ENV PATH /opt/app/node_modules/.bin:$PATH

CMD npm start

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s CMD node healthcheck.js


