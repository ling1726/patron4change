import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../common/utils/configureStore';
import routes from '../common/routes/routing';
import {paymentFees} from '../common/utils/paymentFees'

let state = null;
if (window.$REDUX_STATE) {

	state = window.$REDUX_STATE;

	state.cm = {
		$fetched: '/' === document.location.pathname,
		changemaker: {},
		changemakers: [],
		featuredChangemakers: [],
		backings: [],
		updates: [],
		loadFinished: false
	};

	state.support = {
		$fetched: '/' === document.location.pathname,
		amount: 0,
		grossAmount: 0,
		patron4ChangeFees:0,
		patron4ChangeRate: paymentFees.patron4Change,
		providerFees:0,
		isPeriodic: false,
		providerAdjustableRate: paymentFees.providerAdjustable,
		providerFixedRate: paymentFees.providerFixed,
		paymentUrl: null
	}

	state.search = {
		$fetched: '/' === document.location.pathname,
		results: [],
		term: ''
	};

	state.login = {
		$fetched: '/' === document.location.pathname,
		isAuthenticated: localStorage.id_token ? true:false,
		profile: localStorage.profile ? JSON.parse(localStorage.profile) : null,
		loggedUserId: localStorage.loggedUserId ? parseInt(localStorage.loggedUserId) : null,
		incorrectData: localStorage.incorrectData ? parseInt(localStorage.incorrectData): 0
	}

	state.user = {
		user: {},
		profileUpdate:null
	}
}

const store = configureStore( state )

render(
	<Provider store={store}>
		<Router history={browserHistory} routes={routes} />
	</Provider>,
	document.querySelector('.container')
);
