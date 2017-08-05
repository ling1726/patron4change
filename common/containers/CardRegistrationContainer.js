/* eslint no-undefined: 0 */
// no-undefined: needed for conditional avatarUrl
import React from 'react';
import * as SupportChangemakerActions from '../actions/SupportChangemakerActions'
import { bindActionCreators } from 'redux';
import ActionStatus from '../components/ActionStatus';
import {browserHistory} from 'react-router'
import CardRegistration from '../components/CardRegistration'

import { connect } from 'react-redux';

class CardRegistrationContainer extends React.Component {
	constructor(props){
		super(props)
		this.actions = bindActionCreators(SupportChangemakerActions, props.dispatch);
	}

	componentDidMount() {
		this.actions.preRegisterCard({userId:this.props.userId})
	}

	componentDidUpdate(){
		if(this.props.cardRegistered){
			browserHistory.goBack();
		}
	}

	render() {
		let message = null;
		let status = null
		let statusMessage = null;

		if(this.props.error){
			message = 'Ihre Karte war nicht erfolgreich registriert';
			status = 'failure'
			statusMessage = <ActionStatus
				message={message}
				status={status}
			/>
		}else if(this.props.cardRegistered){
			message = 'Ihre Karte war erfolgreich registriert';
			status = 'success'
			statusMessage = <ActionStatus
				message={message}
				status={status}
			/>
		}

		let registrationForm = null;
		if(this.props.preRegistrationData){
			registrationForm = <CardRegistration
													registrationUrl={this.props.preRegistrationData.CardRegistrationURL}
													accessKey={this.props.preRegistrationData.AccessKey}
													preRegistrationData={this.props.preRegistrationData.PreregistrationData}
													handleRegisterCard={this.actions.registerCard}
													registrationId={this.props.preRegistrationData.Id}
												/>
		}

		return (

			<section>
				{statusMessage}
				{registrationForm}

			</section>
		)
	}

}

export default connect( (state) => ({
	isAuthenticated: state.login.isAuthenticated,
	userId: state.login.loggedUserId,
	preRegistrationData: state.support.preRegistrationData,
	error: state.support.error,
	cardRegistered: state.support.cardRegistered

}) )(CardRegistrationContainer);
