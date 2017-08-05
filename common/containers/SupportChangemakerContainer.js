/* eslint no-undefined: 0 */
// no-undefined: needed for conditional avatarUrl
import React from 'react';
import ChangemakerSupportForm from '../components/ChangemakerSupportForm'
import * as SupportChangemakerActions from '../actions/SupportChangemakerActions'
import { bindActionCreators } from 'redux';
import * as ChangemakerActions from '../actions/ChangemakerActions';
import { fetchNeeds } from '../utils/fetchComponentData';
import ChangemakerCard from '../components/ChangemakerCard';
import ActionStatus from '../components/ActionStatus';
import {browserHistory} from 'react-router'
import * as AuthActions from '../actions/AuthActions'

import { connect } from 'react-redux';

class SupportChangemakerContainer extends React.Component {

	static needs = [
		ChangemakerActions.getChangemakerById
	];

	constructor(props){
		super(props)
		this.actions = bindActionCreators(SupportChangemakerActions, props.dispatch);
		this.authActions = bindActionCreators(AuthActions, props.dispatch);
	}

	componentDidMount() {
		if(!this.props.userId){
			browserHistory.push('/login')
		}
		fetchNeeds( SupportChangemakerContainer.needs, this.props )
	}

	componentWillReceiveProps(nextProps){

		if(null !== nextProps.paymentUrl ){
			window.location.assign(nextProps.paymentUrl);
		}
		''
		if(nextProps.startDate){
			this.actions.endSupportProcess();
			browserHistory.push(`/changemaker/${this.props.changemaker.id}/support/success`)
		}

		if(false === nextProps.cardRegistered){
			browserHistory.push('/user/card')
		}
	}

	render() {
		let changemakerCard = null;
		let changemakerName = null;
		if(this.props.changemaker.id) {
			changemakerCard = <ChangemakerCard changemaker={this.props.changemaker}
																				 showSupport={false}
																				 showAvatar={false} onSupport={() => {
			}}/>
			changemakerName = this.props.changemaker.user.name
		}

			if(this.props.changemaker.id){
				changemakerCard = <ChangemakerCard changemaker={this.props.changemaker}
																					 showSupport={false}
																					 showAvatar={false} onSupport={() => {}}/>
				changemakerName = this.props.changemaker.user.name
			}


			let message = null;
			let status = null
			let statusMessage = null;

			if(this.props.error){
				message = 'Zahlung war nicht erfolgreich';
				status = 'failure'
				statusMessage = <ActionStatus
					message={message}
					status={status}
				/>
		}

		return (
		<section>
			{statusMessage}
			<ChangemakerSupportForm
					amount = {this.props.amount}
					handleAddAmount = {this.actions.addToAmount}
					handleSubtractAmount = {this.actions.subtractFromAmount}
					handleSupport = {this.actions.support}
					grossAmount = {this.props.grossAmount}
					patron4ChangeFees = {this.props.patron4ChangeFees}
					patron4ChangeRate = {this.props.patron4ChangeRate*100}
					providerAdjustableRate = {this.props.providerAdjustableRate}
					providerFixedRate = {this.props.providerFixedRate}
					providerFees = {this.props.providerFees}
					userId = {this.props.userId}
					changemakerId = {this.props.params.changemakerId}
					changemakerName = {changemakerName}
					cardRegistered = {this.props.cardRegistered}
					handleCheckCard = {this.actions.checkUserHasRegisteredCard}
			>
				{changemakerCard}
			</ChangemakerSupportForm>

		</section>
		)
	}

}

export default connect( (state) => ({
	isAuthenticated: state.login.isAuthenticated,
	userId: state.login.loggedUserId,
	amount: state.support.amount,
	grossAmount: state.support.grossAmount,
	patron4ChangeFees:state.support.patron4ChangeFees,
	patron4ChangeRate: state.support.patron4ChangeRate,
	providerFees:state.support.providerFees,
	isPeriodic: state.support.isPeriodic,
	providerAdjustableRate: state.support.providerAdjustableRate,
	providerFixedRate: state.support.providerFixedRate,
	paymentUrl: state.support.paymentUrl,
	changemaker: state.cm.changemaker,
	error: state.support.error,
	startDate: state.support.startDate,
	cardRegistered: state.support.cardRegistered

}) )(SupportChangemakerContainer);
