import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as SearchActions from '../actions/SearchActions';
import { fetchNeeds } from '../utils/fetchComponentData';

import Search, { ResponsiveHint } from '../components/Search';

export class SearchContainer extends Component {

	static needs = [
	];

	constructor(props, context) {
		super(props, context);
		this.actions = bindActionCreators(SearchActions, props.dispatch);
	}

	componentDidMount() {
		fetchNeeds( SearchContainer.needs, this.props )
	}

	render() {
	  const {term} = this.props;
	  return <Search title="patron4change"
			hint={ResponsiveHint()}
			term={term}
			onSearch={this.actions.search}
			onHardConfirm={this.actions.search} />;
	}
}

export default connect( state => ({
	term: state.search.term
}) )(SearchContainer);
