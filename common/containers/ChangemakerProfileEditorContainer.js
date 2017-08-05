import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ChangemakerActions from '../actions/ChangemakerActions';
import { changemaker as Changemaker } from '../constants/Shapes';

import ChangemakerProfileEditor from '../components/ChangemakerProfileEditor';

import styles from '../../client/css/modules/changemaker-profile-editor.scss';

class ChangemakerProfileEditorContainer extends Component {

  state = { saved: false };

  constructor(props) {
    super();
		this.actions = bindActionCreators(ChangemakerActions, props.dispatch);
  }

  componentDidMount() {
    if (!this.props.userId) {
      browserHistory.push('/login');
    }
  }

  onSave(changemaker) {
    this.setState({ saved: true });
    // TODO refactor
    let cm = changemaker;
    if (this.props.videoUrl) {
      cm.videoUrl = this.props.videoUrl;
    }
    cm.fkUserId = this.props.userId;
    this.actions.saveChangemaker(cm);
  }

  onChangeVideoFile(file) {
    this.actions.uploadVideo(file);
  }

  componentDidUpdate() {
    if (this.state.saved && this.props.changemaker.id) {
      browserHistory.push(`/changemaker/${this.props.changemaker.id}`);
    }
  }

  render() {
    let { changemaker, videoUrl } = this.props;
		return <div>
      <h1 className={styles.profileTitle}>Dein Profil</h1>
      <ChangemakerProfileEditor
        changemaker={changemaker}
        videoUrl={videoUrl}
        onSave={this.onSave.bind(this)}
        onChangeVideoFile={this.onChangeVideoFile.bind(this)} />
    </div>;
	}
}

export default connect(
  state => ({
    changemaker: state.cm.changemaker,
    videoUrl: state.cm.videoUrl,
    userId: state.login.loggedUserId
  })
)(ChangemakerProfileEditorContainer);
