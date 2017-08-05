import React, { PropTypes } from 'react';
const { Row, Col } = require('react-flexbox-grid');

import styles from '../../client/css/modules/landing-page.scss';

class Startpage extends React.Component {

  static propTypes = {
    children: PropTypes.object
  }

  render() {
    return <div className={styles.container}>
      <Row>
        <Col xs={12} md={12}>
          <h2>Neuigkeiten von Ihren Changemakern</h2>
  				{this.props.children}
        </Col>
      </Row>
		</div>;
  }
}

export default Startpage;
