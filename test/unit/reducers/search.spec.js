import { expect } from 'chai';

import SearchReducer from '../../../common/reducers/SearchReducer';
import ActionTypes from '../../../common/constants/ActionTypes';

describe('SearchReducer', () => {
  
  const stateObj = { term: '', results: [] };

  it('should return the initial state', () => {
    const state = SearchReducer(stateObj, {});
    expect(state.term).to.equal('');
    expect(state.results).to.be.empty;
  })

  it('should set a new search term on search request', () => {
    const state = SearchReducer(stateObj, {
      type: ActionTypes.GLOBAL_SEARCH_REQUEST,
      term: 'new term'
    });
    expect(state.term).to.equal('new term');
  })
});
