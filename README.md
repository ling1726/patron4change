patron4change
======================================

## Note

This project was implemented as a part of the ASE class. It is a web app written in Node.js and React. It might take some work to make it fully working again, but feel free to explore the code base!

## Introduction

ASE 2016/17 project. A platform for supporting non-profit personal projects and commitment.

## How to run

```
$ npm i
$ npm start
```

Then visit `localhost:3000`. For development it is recommended to run

```
$ npm i -g nodemon
$ npm run watch
```

for automatic watch and restart of the entire application.

To check code style use

```
$ npm run checkstyle
```


To create a production environment build and run it.

```
$ NODE_ENV=production
$ npm run build
$ node server/index.js
```

### Upgrade Notes

- It is highly recommended to always __remove__ `node_modules` and reinstall everything to avoid any possible issues

### Configuration

Configuration files for each environment can be found in the `config` directory.
The `default.yml` file contains all parameters. All other configuration files can override these parameters.
The `$NODE_ENV` environment variable is considered when selecting the configuration file for the current environment.

Create a `local.yml` file for any local configuration you might need.

Further information can be found here: https://www.npmjs.com/package/config

### Using Docker
To use docker, it has to be installed on your machine. Go here to load it for your platform:
https://www.docker.com/products/docker#/

!Warning! This is setup is only tested in an linux environment.

For controlling the docker containers there is a script in the root project folder called `docker-ctrl.sh`.
It can be used to `create`, `stop` and `remove` follwing containers:
* webapp: the central node engine, builds and containerizes the main webapp
* elastic: the default elasticsearch container with persistent storage (also upon removal)
* db: postgres image with persistent data (also upon removal) on port 5432
* testdb: postgres without persistent storage on port 5433 for testing

If you want to remove the persistent data of a container use the -p flag when creating it.


### Testing
The tests are spread among 3 directories.
The `unit` directory holds all unit tests, they are limited to the internal structure of the node app.

The integration tests are split into api tests and database tests. All database modification tests are in the folder `db`.
The tests covering api interaction trough the whole system are located in the `api` subfolder.

For testing the database, a postgres database is needed on port 5433. (`./docker-ctrl.sh create testdb`)

**npm commands**
* npm run unit-test
* npm run db-test
* npm run api-test
