import express from 'express';
import path from 'path';
import uuid from 'uuid';

import serverRender from './render';
import apiRoutes from './api/routes';

import createLogger from './logger';
import runWorkers from './workers';
import model from './model';
import rebuildSearchIndex from './utils/rebuildSearchIndex';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config';
import appConfig from 'config';

import winstonRequestLogger from 'winston-request-logger';
import pretty from 'express-prettify';

import swaggerUi from 'swaggerize-ui';

import jwt from 'express-jwt';

let logger = createLogger();
logger.log('debug', 'env: %s', process.env.NODE_ENV);

// make sure styles are only loaded for client resources
delete process.env.BROWSER;

const app = express();

app.use('/css', express.static(path.join(__dirname, '../client/css')));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use('/api-doc', swaggerUi({docs: '/public/definitions/swagger.yaml'}));

app.use((req, res, next) => {
	// request id for log correlation
	req.reqId = uuid.v4();
	req.logger = createLogger(req.reqId);
	next();
});

let bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(pretty({ query: 'pretty' }));

app.use(winstonRequestLogger.create(logger, {
	responseTime: ':responseTime ms', // outputs '5 ms'
  url: ':url[pathname]'             // outputs '/some/path'
}));

if ('production' !== process.env.NODE_ENV) {
	const compiler = webpack(config);
	app.use(webpackDevMiddleware(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
	}));
	app.use(webpackHotMiddleware(compiler));
}

runWorkers(appConfig.get('queues'), logger);

// init database
let databaseInit;
if('unit' !== process.env.NODE_ENV) {
	databaseInit = model.sequelize.sync();
} else {
	databaseInit = Promise.resolve(true);
}
databaseInit.then(rebuildSearchIndex);

// register protected/unprotected paths
// MUST be done before paths are registered to the router

let jwtCheck = jwt({
	secret: appConfig.get('auth0').secret,
	audience: appConfig.get('auth0').clientId
})

app.use('/api/users/testProtection' , jwtCheck)

// register api paths to router
app.use('/api', apiRoutes, (req, res) => {
	res.status(404).send('Invalid api route');
});

// server rendering
app.use(serverRender(logger));

// example of handling 404 pages
app.get('*', (req, res) => {
	res.status(404).send('Server.js > 404 - Page Not Found');
});

// global error catcher
app.use((err, req, res) => {
  logger.log('error', 'Error on request %s %s', req.method, req.url);
  logger.log('debug', err.stack);
  res.status(500).send('Server error');
});

const port = appConfig.get('port');
app.listen(port, function(){
	logger.info(`Listening on port ${port}`);
}).on('error', function(){
});
