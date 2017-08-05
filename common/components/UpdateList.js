import React from 'react';

import styles from '../../client/css/modules/update.scss';

class UpdateList extends React.Component {

	render() {
		return <div className={styles.list}>
			{this.props.children}
		</div>;
	}
}

export default UpdateList;
