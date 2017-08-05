import React from 'react'
import { renderToString } from 'react-dom/server'
import { RouterContext, match } from 'react-router';
import routes from '../common/routes/routing';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';

import promiseMiddleware from '../common/middleware/PromiseMiddleware';
import combinedReducers from '../common/reducers';

import fetchComponentData from '../common/utils/fetchComponentData';

const finalCreateStore = applyMiddleware(promiseMiddleware)( createStore );

function renderFullPage(html, initialState) {
  const css = '<link href="/public/app.css" rel="stylesheet">';
  const jsPaths = {
    development: 'static',
    production: 'public'
  };
  const pathKey = Object.keys(jsPaths).find(k => process.env.NODE_ENV === k) || 'development';
  return `
	<!doctype html>
	<html lang="utf-8">
	  <head>
		<title>patron4change</title>
		<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
    <link rel="apple-touch-icon" sizes="76x76" href="/public/images/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="/public/images/favicon/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/public/images/favicon/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="/public/images/favicon/manifest.json">
    <link rel="mask-icon" href="/public/images/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="/public/images/favicon/favicon.ico">
    <meta name="msapplication-config" content="/public/images/favicon/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${'production' === process.env.NODE_ENV ? css : ''}
	  </head>
	  <body>
	  <div class="container" style="min-height: 100%;">${html}</div>
		<script>window.$REDUX_STATE = ${initialState}</script>
		<script src="/${jsPaths[pathKey]}/bundle.js" async></script>
	  </body>
	</html>
	`
}

export default (logger) => {
  return ( req, res ) => {

  	const store = finalCreateStore(combinedReducers);

  	// match react-router routes
  	match( {routes, location: req.url}, ( error, redirectLocation, renderProps ) => {

      function render() {
    		const initView = renderToString(
    			<Provider store={store}>
    			  <RouterContext {...renderProps} />
    			</Provider>
    		)

    		let state = JSON.stringify( store.getState() );
    		return renderFullPage( initView, state );
      }

      function okPage(page) {
        return res.status(200).send(page);
      }

      function endWithError(err) {
        return res.end(err.message);
      }

  		if ( error ) {
        logger.error(error);
  			res.status(500).send( error.message );
  			return;
  		}

  		if ( redirectLocation ) {
  			res.redirect( 302, redirectLocation.pathname + redirectLocation.search );
  			return;
  		}

  		if ( null === renderProps ) {
  			res.status(404).send( 'Not found' );
  			return;
  		}

  		// this is where universal rendering happens,
  		// fetchComponentData() will trigger actions listed in static "needs" props in each container component
  		// and wait for all of them to complete before continuing rendering the page,
  		// hence ensuring all data needed was fetched before proceeding
  		//
  		// renderProps: contains all necessary data, e.g: routes, router, history, components...
  		fetchComponentData( store.dispatch, renderProps.components, renderProps.params)
  		.then(render)
  		.then(okPage)
  		.catch(endWithError);
  	})
  };
};
