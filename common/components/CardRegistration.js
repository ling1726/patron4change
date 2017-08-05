import React  from 'react'
import { Grid, Row } from 'react-flexbox-grid';
import {Button} from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';

export default class CardRegistration extends React.Component {
	state = {
		cardNumber: '',
		expirationMonth: '',
		expirationYear:'',
		cardCvx: ''
	}

	handleChange = (name, value) => {
		this.setState({...this.state, [name]: value});
	};

	padNumber(value){
		return 9 < value ? '' + value: '0' + value;
	}

	onClickSubmit(){
		let cardExpirationDate = this.padNumber(this.state.expirationMonth) + this.padNumber(this.state.expirationYear)
		let cardData = {
			cardNumber: this.state.cardNumber,
			cardExpirationDate: cardExpirationDate,
			cardCvx: this.state.cardCvx,
			accessKeyRef: this.props.accessKey,
			data: this.props.preRegistrationData,
			Id: this.props.registrationId

		}
		this.props.handleRegisterCard(cardData, this.props.registrationUrl)
	}

	render() {
		return (
			<div>
				<Grid>
					<br/>
					<h1>Kreditkarte Registrierung</h1>

					<Input type='text' label='Kreditkartennummer' name='cardNumber' value={this.state.cardNumber}
									onChange={this.handleChange.bind(this, 'cardNumber')} maxLength={16}
								 error={isNaN(parseInt(this.state.cardNumber)) ? 'Feld muss ein Nummer sein' : ''}/>
					<Row>
						<Input type='number' label='Kartenablaufdatum MM' hint="MM" name='expirationMonth'
									 value={this.state.expirationMonth}
									 onChange={this.handleChange.bind(this, 'expirationMonth')}
									 error={13 < this.state.expirationMonth || 1 > this.state.expirationMonth ?
										 'Feld muss ein Nummer zwischen 1 und 12 sein' : ''}/>
						<Input type='number' label='Kartenablaufdatum YY' hint="YY" name='expirationYear'
									 value={this.state.expirationYear}
									 onChange={this.handleChange.bind(this, 'expirationYear')}
									 error={99 < parseInt(this.state.expirationYear) ? '' +
									 'Feld muss ein Nummer mit 2 Charakter sein' : ''}/>
					</Row>

						<Input type='text' label='CVV' name='cardCvx' value={this.state.cardCvx}
										onChange={this.handleChange.bind(this, 'cardCvx')} maxLength={3}
									 error={isNaN(parseInt(this.state.cardCvx)) ? 'Feld muss ein Nummer sein' : ''}/>

					<Button icon='save' label='Registrieren' onClick={this.onClickSubmit.bind(this)} raised/>
				</Grid>
			</div>
		)

	}
}

