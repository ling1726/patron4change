import React, { PropTypes } from 'react';
import Snackbar from 'react-toolbox/lib/snackbar';
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card';
import Video from 'react-html5video';
import shaka from 'shaka-player';

import UpdateList from '../components/UpdateList';
import BackingList from '../components/BackingList';
import * as shapes from '../constants/Shapes';

import { Row, Col } from 'react-flexbox-grid';
import styles from '../../client/css/modules/changemaker-profile.scss';

const UpdateSection = props => {
	if (0 < props.StatusUpdates.length) {
		return <div>
			<h2 className={styles.newsHeader}>Neuigkeiten</h2>
			{props.StatusUpdateEditor}
			<UpdateList>
				{props.StatusUpdates}
			</UpdateList>
		</div>;
	}
	if (props.StatusUpdateEditor) {
		return props.StatusUpdateEditor;
	}
	return <p>Noch keine Neuigkeiten von {props.changemaker.user.name}</p>;
}

class ChangemakerProfile extends React.Component {

	static propTypes = {
  	changemaker: shapes.changemaker.isRequired,
    RecurringBackings: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,
    OneTimeBackings: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,
		StatusUpdates: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,
		StatusUpdateEditor: PropTypes.element, // optional, no editing if not passed
		onSupport: PropTypes.func.isRequired
	};

	state = {
		videoError: false
	}

	componentDidUpdate() {
		shaka.polyfill.installAll();
		// TODO check for shaka.Player.isBrowserSupported()
		const video = this.refs.videoContainer.videoEl;
		const mpd = this.refs.videoContainer.props.mpd;
		if (mpd) {
			const player = new shaka.Player(video);
			player.load(mpd).then( () => {
				// console.log('video loaded');
			}).catch( () => {
				this.setState({ videoError: true });
			});
		}
	}

	render() {
		const cm = this.props.changemaker;
		return (
			<div>
				<Row>
					<Col xs={12} md={12} lg={12}>
						<Card className={styles.profileContainer}>
							<Video controls className={styles.video} ref='videoContainer' mpd={cm.videoUrl}>
								<source src="" />
							</Video>
							<Snackbar
								active={this.state.videoError}
								label='Das Video konnte nicht geladen werden'
								ref='videoSnackbar'
								type='warning' />
							<div className={styles.profileContent}>
								<CardTitle
									title={`${cm.user.firstName} ${cm.user.lastName}`}
									subtitle={`${cm.numberOfPatrons} patrons`}
									avatar={cm.user.avatarUrl} />
								<CardText className={styles.mission}>
				        	<p>{cm.mission.text}</p>
					      </CardText>
							</div>
						</Card>
					</Col>
				</Row>
				<Row className={styles.secondRow}>
					<Col xs={12} md={6} lg={6}>
						<BackingList
							changemaker={cm}
							RecurringBackings={this.props.RecurringBackings}
							OneTimeBackings={this.props.OneTimeBackings}
							onSupport={this.props.onSupport}>
						</BackingList>
					</Col>
					<Col xs={12} md={6} lg={6}>
						<UpdateSection {...this.props} />
					</Col>
				</Row>
			</div>
		);
	}
}

export default ChangemakerProfile;
