import React from 'react';
import { connect } from 'react-redux';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { Navigation } from 'react-toolbox/lib/navigation';
import { Link } from 'react-toolbox/lib/link';
import { browserHistory } from 'react-router';
import Auth from '../components/Auth.js'
import styles from '../../client/css/modules/main-nav.scss';
import * as LoginActions from '../actions/AuthActions'
import { bindActionCreators } from 'redux';

class MainNav extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.actions = bindActionCreators(LoginActions, props.dispatch);
		this.onNavigateToProfile = this.onNavigateToProfile.bind(this);
  }

	componentWillMount(){
		if (true === process.env.BROWSER) {
			this.actions.doAuthentication();
			if(1 === this.props.incorrectData && this.props.profile){
				browserHistory.push('/user/profile')
			}
		}
	}

  onNavigateToHome(e) {
    e.preventDefault();
    browserHistory.push('/');
  }

  onNavigateToSearch(e) {
    e.preventDefault();
    browserHistory.push('/search');
  }

	onNavigateToProfile(e) {
		e.preventDefault();
		browserHistory.push(`/changemaker/${this.props.userId}`);
	}

  render() {
		const img = <img className={styles.logo} src="/public/images/logo.png" alt="patron4change logo" />;

    let isStartPage = '/' === this.props.location.pathname;

    return <AppBar className={`${styles.appBar} ${isStartPage ? styles.startAppBar : ''}`}
      title="&nbsp;" leftIcon={img} onLeftIconClick={this.onNavigateToHome}>
			<Navigation type='horizontal'>
				{this.props.isAuthenticated?
					<Link href={`/changemaker/${this.props.userId}`}
						className={styles.changemakerLink}
						onClick={this.onNavigateToProfile}
						icon="person">
          	Mein Profil
        	</Link>
					:
					null
				}
				<Link href="/search" onClick={this.onNavigateToSearch} icon="search">
          Search
        </Link>
				<Auth
					isAuthenticated = {this.props.isAuthenticated}
					profile = {this.props.profile}
					onLoginClick={this.actions.login}
					onLogoutClick = {this.actions.logout}
					doAuthenticate = {this.actions.doAuthentication} />
			</Navigation>
		</AppBar>;
  }
}

export default connect( (state) => ({
	isAuthenticated: state.login.isAuthenticated,
	profile: state.login.profile,
	loginData: state.login.loginData,
	userId: state.login.loggedUserId,
	incorrectData: state.login.incorrectData
}) )(MainNav);
