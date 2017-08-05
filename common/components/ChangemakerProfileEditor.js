import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Card, CardText } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Dropzone from 'react-dropzone';

import * as shapes from '../constants/Shapes';

import styles from '../../client/css/modules/changemaker-profile-editor.scss';

class ChangemakerProfileEditor extends Component {

  static propTypes = {
  	changemaker: shapes.changemaker.isRequired,
    videoUrl: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onChangeVideoFile: PropTypes.func.isRequired
	};

  constructor() {
    super();
    this.state = { mission: '', video: null };
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  onDropFile(files) {
    if (0 < files.length) {
      this.setState({video: files[0]});
      this.props.onChangeVideoFile(files[0]);
    }
  }

  onSave() {
    let changemaker = this.props.changemaker;
    const { mission, firstName, lastName } = this.state;
    let newChangemaker = Object.assign({}, changemaker, {
      user: {
        firstName,
        lastName
      },
      mission: {
        text: mission
      }
    });
    this.props.onSave(newChangemaker);
  }

  render() {
    const { videoUrl } = this.props;
    return (
      <Card>
        <CardText>
          <Grid>
            <Row>
              <Col xs={12} md={8} lg={8}>
                <Input type='text' multiline label='Beschreibe, was du schon immer an der Welt verändern wolltest' rows={10}
                  value={this.state.mission} onChange={this.handleChange.bind(this, 'mission')}/>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <Dropzone multiple={false} maxSize={100000000}
                  className={styles.dropzone} activeClassName={styles.dropzoneActive} rejectClassName={styles.dropzoneReject}
                  onDrop={this.onDropFile.bind(this)}>
                  {this.state.video ? <div>Video vorhanden</div> : <div>Video hier ablegen</div>}
                </Dropzone>
                {!this.state.video || this.state.video && videoUrl ? '' : <ProgressBar mode='indeterminate' />}
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Button label='Speichern' onClick={this.onSave.bind(this)} raised primary />
              </Col>
            </Row>
          </Grid>
        </CardText>
      </Card>
    );
  }
}

export default ChangemakerProfileEditor;
