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
