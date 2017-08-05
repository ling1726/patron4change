import React from 'react';
import { browserHistory } from 'react-router';
import {AppBar} from 'react-toolbox/lib/app_bar';
import {Link} from 'react-toolbox/lib/link';
import {FontIcon} from 'react-toolbox/lib/font_icon';

import styles from '../../client/css/modules/main-nav.scss';

export default class SearchNav extends React.Component {

	static propTypes = {
		children: React.PropTypes.object
	}

	onNavigateToHome(e) {
		e.preventDefault();
		browserHistory.push('/');
	}

	render() {
		return <AppBar className={styles.appBar}>
			<Link className={styles.searchBack} href="/" onClick={this.onNavigateToHome}>
				<FontIcon value="arrow_back" />
			</Link>
			{this.props.children}
		</AppBar>;
	}
}
