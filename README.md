# Complicated fibonacci server

From Grider's Docker & Kubernetes course on Udemy.

## Video 139 Postgres Database Required Fixes and Updates

_updated 6-12-2020_

Due to a recent update in the official Postgres image hosted on the
DockerHub we need to make a change to our environment variables.

Add the following to your docker-compose.yml file in the postgres service:

```yaml
postgres:
  image: 'postgres:latest'
  environment:
    - POSTGRES_PASSWORD=postgres_password
```

`docker-compose down && docker-compose up --build`

Please note, all of these changes are reflected in the downloadable checkpoint zip files.

## Video 141 Required Client Service Update and Worker Environment Variables

In the next lecture, we will be adding a client and worker service. There are two required configuration updates that need to be made:

1. When adding the "Client" service, be sure to include the `stdin_open: true` configuration:

```yaml
client:
  stdin_open: true
  build:
    dockerfile: Dockerfile.dev
    context: ./client
  volumes:
    - /app/node_modules
    - ./client:/app
```

Otherwise, you will get a **"React App exited with Code 0"** error in your terminal when we attempt to start up the application.

2. When adding the **"Worker"** service, include the Redis host and port as environment variables:

```yaml
worker:
  build:
    dockerfile: Dockerfile.dev
    context: ./worker
  volumes:
    - /app/node_modules
    - ./worker:/app
  environment:
    - REDIS_HOST=redis
    - REDIS_PORT=6379
```

Otherwise, you will get a **"Calculated Nothing Yet"** error message.

## Video 147 Nginx connect() failed - Connection refused while connecting to upstream

A small number of students are hitting an edge case where the nginx upstream connection is failing after they run `docker-compose up --build`:

connect() failed (111: Connection refused) while connecting to upstream, client:[DOCKER INTERNAL IP], server:, request: "GET / HTTP/1.1", upstream: [NETWORK IP]

The solution they found was to add this to their nginx service in the docker-compose.yml file:

```yaml
nginx:
  depends_on:
    - api
    - client
```

## Video 151 Important Node Image Version Update

10-26-2020

In the next lecture, we will be creating a Dockerfile for the production server container. The Node v15 image was just released a few days ago and is breaking the code in our server/index.js.

To work around this, we need to change the version of Node this container will use:

`FROM node:alpine`

to this:

`FROM node:14.14.0-alpine`

## Video 154 Nginx fix for React Router

In the next lecture, we will be adding some Nginx config to the client-side project, but I neglected to add one line that would get the Nginx server to work correctly when using React Router!

In the **client/nginx/default.conf** file, please add the following line to the end of the location directive:

    `try_files $uri $uri/ /index.html;`

The default.conf should now look like this:

```nginx
    server {
      listen 3000;

      location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
      }
    }
```

## Video 158 Fix for Failing Travis Builds

In the upcoming lecture, we will be adding a script to our .travis.yml file. Due to a change in how the Jest library works with Create React App, we need to make a small modification:

```yaml
script:
  - docker run USERNAME/react-test npm test -- --coverage
```

instead should be:

```yaml
script:
  - docker run -e CI=true USERNAME/react-test npm test -- --coverage
```

You can read up on the CI=true variable here:

https://facebook.github.io/create-react-app/docs/running-tests#linux-macos-bash

and environment variables in Docker here:

https://docs.docker.com/engine/reference/run/#env-environment-variables

Additionally, you may want to set the following property if your travis build fails with “rakefile not found” by adding to the top of your .travis.yml file:

```yaml
language: generic
```
