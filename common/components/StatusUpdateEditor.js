import React, { PropTypes } from 'react';
import { Input } from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';


class StatusUpdateEditor extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    onTextChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

	render() {
    const { title, text } = this.props;
		return <div>
      <Input type='text' label='Schlagzeile' maxLength={80}
        value={title} onChange={this.props.onTitleChange} required/>
      <Input type='text' multiline hint='Was gibt es neues?' rows={5} maxLength={200}
        value={text} onChange={this.props.onTextChange} required/>
      <Button raised onClick={this.props.onConfirm} disabled={!title || !text}>Hinzufügen</Button>
    </div>;
	}
}

export default StatusUpdateEditor;
