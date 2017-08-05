import React, { Component, PropTypes } from 'react';
import 'react-toolbox/lib/commons.scss';

import '../../client/css/theme/app.scss';
import styles from '../../client/css/modules/app.scss';

export default class App extends Component {

	static contextTypes = {
		store: PropTypes.object.isRequired
	};

	static propTypes = {
		nav: PropTypes.element.isRequired,
		main: PropTypes.element.isRequired,
		sub: PropTypes.element,
		location: PropTypes.any.isRequired
	}

	render() {

		let isStartPage = '/' === this.props.location.pathname;
		return <div className={isStartPage ? styles.startPage : ''}>
			{this.props.nav}
			<main>{this.props.main}</main>
			{this.props.sub}
		</div>;
	}
}
