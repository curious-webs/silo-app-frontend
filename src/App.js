import React, {Component} from 'react';
import jwtDecode from 'jwt-decode';
import {Router, Route, Redirect, Switch} from 'react-router-dom';
import SigIn from './components/signin';
import SignUp from './components/signup';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './logo.svg';
import './App.css';
import Dashboard from './components/dashboard';
import * as auth from './services/authService';

import NavBar from './components/navigation';
import VerifyEmail from './components/verify-email';
import ForgotPassword from './components/forgot-password';
import ResetPassword from './components/reset-password';
import ResendVerificationLink from './components/resendVerificationLink';
import ProfileDashboard from './components/profile-dashboard';
import EditProfile from './components/edit-profile';
import Addresses from './components/addresses';
import {updateProfileImg} from './services/profileImgService';
import {userInfo} from './services/userInfoService';
import ChangePassword from './components/change-password';
import Input from './components/common/Input';
import Form from './components/common/form';

class App extends Component {
  state = {
    data: {},
    errors: {},
  };

  componentDidMount = async () => {
    let user = await userInfo (auth.getUser ());
    this.setState ({user: user.data});
    this.setState ({data: user.data});
  };

  handleProfileImage = async ({ currentTarget: input }) => {
    console.log ('Working in profile Image function of app.js');
  
    let user = {...this.state.user};
    user["profileImg"] = input.files[0];
    this.setState({user});
  };

  render () {
    const {user} = this.state;
    return (
      <React.Fragment>
        <ToastContainer />
        {auth.isLogin () && <NavBar user={user} />}
        <Switch>
          {auth.isLogin () &&
            <React.Fragment>
              <Route path="/dashboard" component={Dashboard} />

              <Route
                path="/editprofile"
                render={props => <EditProfile {...props} />}
              />
              <Route
                path="/profile"
                render={props => (
                  <ProfileDashboard
                  formComponent = {<Form/>}
                    user={user}
                    onFileAppChange={this.handleProfileImage}
                  />
                )}
              />

              <Route
                path="/addresses"
                render={props => <Addresses user={user} />}
              />
              <Route
                path="/change-password"
                render={props => <ChangePassword user={user} />}
              />
              <Redirect from="/forgot-password" exact to="/dashboard" />
              <Redirect
                from="/resend-verification-link"
                exact
                to="/dashboard"
              />
              <Redirect from="/reset-password" exact to="/dashboard" />
              <Redirect from="/signup" exact to="/dashboard" />
              <Redirect from="/signin" exact to="/dashboard" />
              <Redirect from="/verify-email" exact to="/dashboard" />
              <Redirect from="/verify-email/:token" exact to="/dashboard" />

            </React.Fragment>}
          {!auth.isLogin () &&
            <React.Fragment>
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route
                path="/resend-verification-link"
                component={ResendVerificationLink}
              />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/signup" component={SignUp} />
              <Route path="/signin" component={SigIn} />
              <Route path="/verify-email" component={VerifyEmail} />
              <Route path="/verify-email/:token" component={VerifyEmail} />
            </React.Fragment>}

          <Redirect from="/" exact to="/signin" />
          <Redirect to="/not-found" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
