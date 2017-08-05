import { Snackbar } from 'react-toolbox/lib/snackbar';
import React from 'react';

export default class ActionStatus extends React.Component{
	state = {
		active: true
	};

	componentWillReceiveProps(){
		this.setState({active:true});
	}
	handleSnackbarClick(){

		this.setState({ active: false });
	}

	handleSnackbarTimeout(){
		this.setState({active:false});
	}

	render(){
		let type = 'accept'
		switch(this.props.status){
			case 'success':
				break;
			case 'failure':
				type = 'cancel';
				break;
			case 'info':
				type = 'warning';
				break;
		}

		return (
			<Snackbar
				action='schließen'
				label={this.props.message}
				onClick={this.handleSnackbarClick.bind(this)}
				active={this.state.active}
				timeout={2000}
				type={type}
			/>
		)
	}
}
