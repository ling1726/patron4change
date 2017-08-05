import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import LandingPage from '../components/LandingPage';

import ChangemakerCard from '../components/ChangemakerCard';
import * as ChangemakerActions from '../actions/ChangemakerActions';
import * as SearchActions from '../actions/SearchActions';
import { fetchNeeds } from '../utils/fetchComponentData';

class LandingPageContainer extends Component {

	static needs = [
		ChangemakerActions.getFeaturedChangemakers
	];

	constructor(props, context) {
		super(props, context);
		this.actions = bindActionCreators(ChangemakerActions, props.dispatch);
		this.searchActions = bindActionCreators(SearchActions, props.dispatch);
		this.onSearch = this.onSearch.bind(this);
	}

	componentDidMount() {
		fetchNeeds( LandingPageContainer.needs, this.props )
	}

	onSearch(term, move) {
		this.searchActions.search(term);
		if (move) {
			browserHistory.push('/search');
		}
	}

	render() {
	  const { featuredChangemakers, term } = this.props;

	  const nodes = featuredChangemakers.map( cm => {
			return <ChangemakerCard
			  key={`cm-${cm.id}`}
			  changemaker={cm}
				showSupport={false}
				showAvatar={false}
			  onSupport={() => this.actions.supportChangemaker(cm.id)} />
	  });

		// const Wrapper = 'number' === typeof userId ? Startpage : LandingPage;

		const Wrapper = LandingPage;

	  return <Wrapper onSearch={this.onSearch} term={term}>
		  {nodes}
		</Wrapper>;
	}
}

export default connect( state => ({
	featuredChangemakers: state.cm.changemakers.filter(c => state.cm.featuredChangemakers.includes(c.id)),
	userId: state.login.loggedUserId,
	term: state.search.term || ''
}) )(LandingPageContainer);
