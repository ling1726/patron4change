import React, { Component } from 'react'
import { Link } from 'react-toolbox/lib/link';
import styles from '../../client/css/modules/main-nav.scss';
import Drawer from 'react-toolbox/lib/drawer';
import { browserHistory } from 'react-router';


export default class Auth extends Component {
	state = {
		active: false
	}

	handleToggle(){
		this.setState({active: !this.state.active});
	}

	handleAccountSettings(){
		this.setState({active: !this.state.active});
		browserHistory.push('/user/profile');
	}

	handleLogout(){
		this.props.onLogoutClick();
		browserHistory.push('/');
	}

	render() {

		const { onLoginClick, isAuthenticated } = this.props
		let loginButton = null;
		if(!isAuthenticated){
			loginButton = <Link className={styles.changemakerLink} onClick={onLoginClick} icon="exit_to_app">Anmelden</Link>
		}else{
			loginButton = <Link icon="settings" onClick={this.handleToggle.bind(this)}>Mein Konto
				<Drawer active={this.state.active} onOverlayClick={this.handleToggle.bind(this)}>
					<Link className={styles.changemakerLink} onClick={this.handleLogout.bind(this)}
								icon="power_settings_new">Ausloggen </Link>
					<Link className={styles.changemakerLink} onClick={this.handleAccountSettings.bind(this)}
								icon="settings">Kontoeinstellung</Link>
				</Drawer>
			</Link>

		}

		return (
				loginButton

		)
	}
}
