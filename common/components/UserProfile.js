import React from 'react'
import countries from '../../public/countries'
import Dropdown from 'react-toolbox/lib/dropdown';
import { Grid, Row } from 'react-flexbox-grid';
import { Card, CardText } from 'react-toolbox/lib/card';
import {Button} from 'react-toolbox/lib/button';
import {browserHistory} from 'react-router'
import Input from 'react-toolbox/lib/input';

export default class UserProfile extends React.Component {
	checkProfile(){
		if(!this.props.user.firstName){
			return false;
		}
		if(!this.props.user.lastName){
			return false;
		}
		if(!this.props.user.birthday){
			return false;
		}
		if(!this.props.user.nationality){
			return false;
		}
		if(!this.props.user.countryOfResidence){
			return false;
		}

		return true;
	}

	onChangeNationality(value){
		this.props.user.nationality = value;
		this.setState();
	}

	onChangeResidence(value){
		this.props.user.countryOfResidence = value;
		this.setState();
	}

	onChangeFirstName(value){
		this.props.user.firstName = value;
		this.setState();
	}

	onChangeLastName(value){
		this.props.user.lastName = value;
		this.setState();
	}

	onChangeBirthday(value){
		this.props.user.birthday = value;
		this.setState();
	}

	onGoBack(){
		browserHistory.goBack();
	}


	onClickUpdate(){
		let myUser = {
			id: this.props.user.id,
			firstName: this.props.user.firstName,
			lastName: this.props.user.lastName,
			birthday: new Date(this.props.user.birthday).getTime(),
			email: this.props.user.email,
			nationality: this.props.user.nationality,
			countryOfResidence: this.props.user.countryOfResidence
		};

		this.props.handleUpdate(myUser)
	}

	render() {
		let warning = null;
		if(!this.checkProfile()){
			warning = <Card style={{width: '350px'}} raised>
				<CardText>Ihr Profil ist nicht vollständig, bitte ergänzen Sie die fehlenden Felder</CardText>
			</Card>;
		}

		return (
			<div>
				<Grid>
					<Row center="lg">
					{warning}
					</Row>
					<br/>
					<h1>Ihre Konto</h1>

					<Input type='email' label='Email' name='email' value={this.props.user.email} disabled/>
					<Input type='text' label='Vorname' name='firstName' value={this.props.user.firstName}
								 onChange={this.onChangeFirstName.bind(this)}/>
					<Input type='text' label='Nachname' name='lastName' value={this.props.user.lastName}
								 onChange={this.onChangeLastName.bind(this)}/>
					<Input type='date' label='Geburtstag' name='birthday' value={this.props.user.birthday}
								 onChange={this.onChangeBirthday.bind(this)}/>

					<Dropdown
						auto
						source={countries}
						value={this.props.user.nationality}
						label='Staatsangehörigkeit'
						onChange={this.onChangeNationality.bind(this)}
					/>

					<Dropdown
						auto
						source={countries}
						value={this.props.user.countryOfResidence}
						label='Wohnsitz'
						onChange={this.onChangeResidence.bind(this)}
					/>

					<Row>
					<Button icon='save' label='Speichern' onClick={this.onClickUpdate.bind(this)} raised/>
					<Button icon='keyboard_backspace' label='Zurük' onClick={this.onGoBack} raised/>
					</Row>
				</Grid>
			</div>
		)

	}
}
