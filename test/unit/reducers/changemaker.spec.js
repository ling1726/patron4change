import { expect } from 'chai';

import ChangemakerReducer from '../../../common/reducers/ChangemakerReducer';
import ActionTypes from '../../../common/constants/ActionTypes';

describe('ChangemakerReducer', () => {

  let stateObj;

  beforeEach(() => {
    stateObj = {
      featuredChangemakers: [],
      changemakers: [],
      changemaker: {},
      backings: []
    };
  })

  it('should return the initial state on empty action', () => {
    const state = ChangemakerReducer(stateObj, {});
    expect(state.changemakers).to.be.empty;
    expect(state.featuredChangemakers).to.be.empty;
    expect(state.backings).to.be.empty;
  });

  it('should set featured changemakers, and merge the new changemakers into the list', () => {
    const matthias = {
      id: 2,
      name: 'Matthias Holzer'
    };

    const state = ChangemakerReducer(stateObj, {
      type: ActionTypes.GET_FEATURED_CHANGEMAKERS_SUCCESS,
      result: [
        matthias
      ]
    });
    expect(state.changemakers[0]).to.deep.equal(matthias);
    expect(state.featuredChangemakers[0]).to.equal(2);
  });

  it('should set the supporters as soon as they\'re loaded', () => {
    const john = {
      id: 2,
      name: 'John Mister'
    };

    const state = ChangemakerReducer(stateObj, {
      type: ActionTypes.GET_BACKINGS_SUCCESS,
      result: [
        john
      ]
    });
    expect(state.backings[0]).to.deep.equal(john);
  })
});
