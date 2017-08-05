import React from 'react'
import { Route } from 'react-router'


import LandingPageContainer from '../containers/LandingPageContainer';
import SearchContainer from '../containers/SearchContainer';
import SearchResultContainer from '../containers/SearchResultContainer';
import ChangemakerProfileContainer from '../containers/ChangemakerProfileContainer';
import ChangemakerProfileEditorContainer from '../containers/ChangemakerProfileEditorContainer';
import MainNav from '../containers/MainNav';
import TestPage from '../containers/TestPage';
import SupportChangemakerContainer from '../containers/SupportChangemakerContainer'
import UserProfileContainer from '../containers/UserProfileContainer'
import ChangemakerPaymentConfirmationContainer from '../containers/ChangemakerPaymentConfirmationContainer'
import CardRegistrationContainer from '../containers/CardRegistrationContainer'

import SearchNav from '../components/SearchNav';
import App from '../components/App';

import NotFound from '../components/NotFound';
import LoginContainer from '../containers/LoginContainer'

const Empty = () => <div></div>;

const SearchNavContainer = () => <SearchNav><SearchContainer /></SearchNav>;

export default (

  <Route component={App}>

	<Route path="/"
		   components={{main: LandingPageContainer, nav: MainNav, sub: Empty}} />

  // for regular users - a list of all supported changemakers
  // for admins - a list of all changemakers, whereas the unvetted changemakers are shown first

	<Route path="/login" components={{main:LoginContainer, nav: MainNav, sub:Empty}} />
	<Route path="/changemaker"
		   components={{main: Empty, nav: MainNav, sub: Empty}} />

	<Route path="/user/profile" components={{main:UserProfileContainer, nav:MainNav, sub:Empty}} />

	<Route path="/changemaker/new"
		   components={{main: ChangemakerProfileEditorContainer, nav: MainNav, sub: Empty}} />

  // changemaker detail page
	<Route path="/changemaker/:changemakerId"
		   components={{main: ChangemakerProfileContainer, nav: MainNav, sub: Empty}} />

  // changemaker support payment page
	<Route path="/changemaker/:changemakerId/support"
		   components={{main: SupportChangemakerContainer, nav: MainNav, sub: Empty}} />
		<Route path="/changemaker/:changemakerId/support/success"
					 components={{main: ChangemakerPaymentConfirmationContainer, nav: MainNav, sub: Empty}} />

	// card registration page
	<Route path="/user/card" components={{main: CardRegistrationContainer, nav: MainNav, sub:Empty}} />

	<Route path="/search"
		   components={{main: SearchResultContainer, nav: SearchNavContainer, sub: Empty}} />

  <Route path="/test/:componentId"
			 components={{main: TestPage, nav: Empty, sub: Empty}} />

	<Route path="*"
		   components={{main: NotFound, nav: MainNav, sub: Empty}} />
  </Route>

)
