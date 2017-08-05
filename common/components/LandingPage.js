import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Button } from 'react-toolbox/lib/button';
import { browserHistory } from 'react-router';

import * as shapes from '../constants/Shapes';
import Search from './Search';

import styles from '../../client/css/modules/landing-page.scss';
import SideScroller from './SideScroller';

class LandingPage extends React.Component {

  static propTypes = {
    children: shapes.children.isRequired,
    term: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired
  }

  toBecomeChangmaker() {
    browserHistory.push('/changemaker/new');
  }

  render() {
    let { term } = this.props;

    return <Grid className={styles.container}>
      <Row>
        <img className={styles.startLogo} src="/public/images/logo.png" alt="patron4change logo" />
      </Row>
      <Row className={styles.callToActionContainer}>
        <Col xs={0} md={3} lg={3} />
        <Col xs={12} md={6} lg={6} className={styles.callToAction}>
          <h2 className={styles.callToActionText}>Was wolltest du schon immer an der Welt verändert sehen?</h2>
          <Search hint="Inspirierende Changemaker finden"
            term={term}
            onSearch={t => this.props.onSearch(t, false)}
            onHardConfirm={t => this.props.onSearch(t, true)} />
          <p> oder </p>
          <Button primary raised onClick={this.toBecomeChangmaker}>selbst Changemaker werden</Button>
        </Col>
        <Col xs={0} md={3} lg={3} />
      </Row>
			<Row>
        <Col xs={0} md={1} lg={1} />
        <Col xs={12} md={10} lg={10}>
          <h2 className={styles.featuredTitle}>Aktive Changemaker</h2>
          <SideScroller>
  				    {this.props.children}
          </SideScroller>
        </Col>
        <Col xs={0} md={1} lg={1} />
			</Row>
		</Grid>;
  }
}

export default LandingPage;
