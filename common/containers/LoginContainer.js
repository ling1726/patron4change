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

class LoginContainer extends React.Component {

	constructor(props){
		super(props)
		this.actions = bindActionCreators(AuthActions, props.dispatch);
	}

	componentDidMount() {
		if(!this.props.userId) {
			this.actions.login();
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.userId){
			browserHistory.go(-2);
		}
	}

	render() {


		return (
			<section>

			</section>
		)
	}

}

export default connect( (state) => ({
	isAuthenticated: state.login.isAuthenticated,
	userId: state.login.loggedUserId,
}) )(LoginContainer);
