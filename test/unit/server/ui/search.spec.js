const {assert} = require('chai');

import React from 'react';
import _ from 'lodash';
import { render } from 'enzyme';
import { SearchContainer } from '../../../../common/containers/SearchContainer'

describe('<SearchContainer />', () => {

	it('should contain a search term element', () => {
		const props = {
			term: 'test & term',
			dispatch: _.noop
		};
		const wrapper = render(<SearchContainer {...props} />)
		const searchTerm = wrapper.find('#search-term');
		assert.equal(searchTerm.length, 1)
	})

	it('should set the stored term in the search term field', () => {
		const props = {
			term: 'test & term',
			dispatch: _.noop
		};
		const wrapper = render(<SearchContainer {...props} />)
		const searchTerm = wrapper.find('#search-term');
		assert.equal(searchTerm.attr('value'), 'test & term');
	})
})
