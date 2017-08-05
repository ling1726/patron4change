/* eslint no-undefined: 0 */
// no-undefined: needed for conditional avatarUrl
import React from 'react';
import Button  from 'react-toolbox/lib/button';
import { Grid, Row } from 'react-flexbox-grid';
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'
import { browserHistory } from 'react-router';

class ChangemakerPaymentConfirmation extends React.Component {
	state = {
		redirect: false
	};

	handleClickHome(){
		browserHistory.push('/');
	}

	render() {

		let message = `Ihre Zahlung war erfolgreich, 
							${this.props.changemakerName} werde bald Ihre Unterstützung erhalten`;
		if(this.props.startDate){
			let startDate = new Date(parseInt(this.props.startDate))
			message = `Ihre Unterstützung war erfolgreich, ${this.props.changemakerName} 
								werde bald Ihre Unterstützung erhalten. Diese Unterstünstung ist am ${startDate} erstellt`
		}

		return (

			<Grid>
				<Row>
				<Card style={{width: '350px'}}>
					<CardTitle
						title="Vielen Dank"
						subtitle='Ihre Unterstützung war erfolgreich'
					/>
					<CardText>
						{message}
					</CardText>
					<CardActions>
						<Button label="Zurück" onClick={this.handleClickHome}/>
					</CardActions>
				</Card>
				</Row>

			</Grid>
		)
	}

}

export default ChangemakerPaymentConfirmation;
