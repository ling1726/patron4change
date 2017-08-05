/* eslint no-undefined: 0 */
// no-undefined: needed for conditional avatarUrl
import React from 'react';
import * as ChangemakerActions from '../actions/ChangemakerActions';
import { fetchNeeds } from '../utils/fetchComponentData';
import ChangemakerPaymentConfirmation from '../components/ChangemakerPaymentConfirmation';

import { connect } from 'react-redux';

class ChangemakerPaymentConfirmationContainer extends React.Component {

	static needs = [
		ChangemakerActions.getChangemakerById
	];

	componentDidMount() {
		fetchNeeds( ChangemakerPaymentConfirmationContainer.needs, this.props )
	}


	render() {
		let changemakerName = null;
		if(this.props.changemaker.id){
			changemakerName = this.props.changemaker.user.name
		}

		return (
			<ChangemakerPaymentConfirmation
				startDate={this.props.startDate}
				changemakerName={changemakerName}
			/>
		)
	}

}

export default connect( (state) => ({
	changemaker: state.cm.changemaker,
	startDate: state.support.startDate

}) )(ChangemakerPaymentConfirmationContainer);
