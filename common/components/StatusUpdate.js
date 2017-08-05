import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card';
import moment from 'moment';

import * as shapes from '../constants/Shapes';

import styles from '../../client/css/modules/update.scss';

class StatusUpdate extends Component {

  static propTypes = {
    update: shapes.statusUpdate.isRequired
  };

	render() {
    const update = this.props.update;
		return (
			<Card className={styles.card}>
        <CardTitle
          title={update.title}
          subtitle={moment(update.createdAt).fromNow()} />
        <CardText>
          {update.text}
        </CardText>
      </Card>
		);
	}
}

export default StatusUpdate;
