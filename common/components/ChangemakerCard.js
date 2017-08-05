/* eslint no-undefined: 0 */
// no-undefined: needed for conditional avatarUrl
import React, {PropTypes} from 'react';
import { browserHistory } from 'react-router';
import { Button } from 'react-toolbox/lib/button';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';

import * as languageUtils from '../utils/language';
import * as Shapes from '../constants/Shapes';

import styles from '../../client/css/modules/changemaker-card.scss';

class ChangemakerCard extends React.Component {

  static propTypes = {
  	changemaker: Shapes.changemaker.isRequired,
    showSupport: PropTypes.bool.isRequired,
    showAvatar: PropTypes.bool.isRequired,
  	onSupport: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.onNavigateToDetails = this.onNavigateToDetails.bind(this);
    this.onNavigateToSupport = this.onNavigateToSupport.bind(this);
  }

  onNavigateToDetails(e) {
    e.preventDefault();
    const { id } = this.props.changemaker;
    browserHistory.push(`/changemaker/${id}`);
  }

  onNavigateToSupport(e) {
    e.preventDefault();
    const { id } = this.props.changemaker;
    browserHistory.push(`/changemaker/${id}/support`);
  }

  render() {
    const { changemaker, showSupport, showAvatar } = this.props;
  	const cm = changemaker;
    const patronCaption = {
      '0': 'keine Patrons',
      '1': '%d Patron',
      '*': '%d Patrons'
    };
  	return <Card className={styles.item}>
	    <CardMedia
	      aspectRatio="wide"
	      image={`/public/images/thumb/${cm.id > 11 ? 9 : cm.id}.jpg`} />
	    <CardTitle
        title={cm.user.name}
        subtitle={languageUtils.pluralize(cm.numberOfPatrons, patronCaption)}
        avatar={showAvatar ? cm.user.avatarUrl : undefined} />
	    <CardText className={styles.text}>
        <p className={styles.textContent}>{cm.mission.text}</p>
        <p className={styles.readMore}></p>
      </CardText>
	    <CardActions>
	      <Button label="mehr erfahren" icon="info_outline" onClick={this.onNavigateToDetails} />
	      {showSupport && <Button label="unterstützen" icon="star_border" onClick={this.onNavigateToSupport} />}
	    </CardActions>
	  </Card>;
  }
}

export default ChangemakerCard;
