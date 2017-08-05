import React from 'react';
import { connect } from 'react-redux';

import SearchResult from '../components/SearchResult';
import SearchResultItem from '../components/SearchResultItem';

export class SearchResultContainer extends React.Component {

  render() {
    let { results } = this.props;

	  const nodes = results.map( item => {
			return <SearchResultItem
			  key={`search-result-${item.changemakerId}`}
        className="search-result-item"
			  changemaker={item.changemaker}
        match={item} />;
	  });

    return <SearchResult>
      {nodes}
    </SearchResult>;
  }
}

export default connect( state => {
  // TODO store as index in flux store
  let cmIdx = state.cm.changemakers.reduce((ctx, next) => {
    ctx[next.id] = next;
    return ctx;
  }, {});
  return {
  	results: state.search.results.map(result => {
      return {changemaker: cmIdx[result.changemakerId], ...result};
    })
  };
})(SearchResultContainer);
