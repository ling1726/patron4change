import React, { Component } from 'react';
import UserProfile from '../components/UserProfile'
import * as UserActions from '../actions/UserActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionStatus from '../components/ActionStatus'

export class UserProfileContainer extends Component{

	constructor(props, context) {
		super(props, context);
		this.actions = bindActionCreators(UserActions, props.dispatch);
	}

	componentDidMount() {
		if (true === process.env.BROWSER) {
			this.actions.getUserById(this.props.profile.email)
		}
	}

	render(){
		let message = null;
		let status = null
		let statusMessage = null;
		if(true === this.props.profileUpdate){
			message = 'Profil war erfolgreich gespeichert';
			status = 'success'
			statusMessage = <ActionStatus
												message={message}
												status={status}
											/>
		}else if(false === this.props.profileUpdate){
			message = 'Profil war nicht erfolgreich gespeichert';
			status = 'failure'
			statusMessage = <ActionStatus
				message={message}
				status={status}
			/>
		}

		return (
		<div>
			<UserProfile
				user = {this.props.user}
				handleUpdate = {this.actions.updateUser}
			/>

			{statusMessage}
		</div>
		)
	}

}

export default connect( state => ({
	isAuthenticated: state.login.isAuthenticated,
	profile: state.login.profile,
	userId: state.login.loggedUserId,
	user: state.user.user,
	profileUpdate: state.user.profileUpdate
}) )(UserProfileContainer);
