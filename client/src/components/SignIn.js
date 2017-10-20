import React, { Component } from 'react';
import { Container, Form, Button, Message, Header, Grid, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
  axiosSignIn,
  signInErrorClear,
  signUpSuccessClear,
} from '../actions';

import LandingNavbar from './LandingNavbar';

import signin_pic from '../assets/images/sign_in.png';

const styles = {
  customContainer: {
    marginTop: 10,
    marginLeft: 0,
  },
};

const MyContainer = styled.div`
width: 100%;
height: 100%;
margin-left: 0px;
padding: 0px;
${'' /* background: #0099FF; */}

`;

const ErrorMessage = ({formErrors}) => (
  <Container>
    <div></div>
    {Object.keys(formErrors).map((fieldName, i) => {
      if (formErrors[fieldName].length > 0) {
        return (
         
          <Message negative>
            <p key={i}>{fieldName} {formErrors[fieldName]}</p>
          </Message>

        );
      }
    })}
  </Container>
);

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      formErrors: { email: '', password: '' },
      emailValid: false,
      passwordValid: false,
      formValid: false,
    };
  }

  componentDidMount() {
    if(localStorage.getItem('token') != null) {
      this.props.history.push('/home');
    }

    this.props.signInErrorClear();
    // this.props.signUpSuccessClear();
  }

  handleSignIn(e) {
    e.preventDefault();
    console.log('handleSignIn', this.state);

    this.props.axiosSignIn(this.state, this.props.history);

    // if(this.props.is_authenticated) {
    //   this.props.history.push('/home');
    // } else {
    //   alert('Please check your email and password again.');
    // }

  }

  validateField(fieldName, value) {
    const formErrorsValidation = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        formErrorsValidation.email = emailValid ? '' : ' is invalid';
        break;
      case 'password':
        passwordValid = value.length >= 4;
        formErrorsValidation.password = passwordValid ? '' : ' is too short';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrorsValidation,
      emailValid,
      passwordValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({ formValid: this.state.emailValid && this.state.passwordValid });
  }

  handleChange(e) {
    const target = e.target;
    console.log(`handleChange ${target.name}=[${target.value}]`);
    
    this.setState({
      [target.name]: target.value,
    }, () => {
      this.validateField(target.name, target.value);
    });
  }


  render() {
    return (
      <MyContainer>

        <LandingNavbar />
        <p></p>
        <Container style={styles.customContainer}>
          <Grid>
            <Grid.Row></Grid.Row>
          </Grid>
          <Grid>
            <Grid.Row>
              <Grid.Column width={2}>
                
              </Grid.Column>
              <Grid.Column width={6}>
                <Image src={signin_pic} />
              </Grid.Column>
              <Grid.Column width={6}>
                <p><span style={{fontSize: 20}}>Sign in</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; or  <Link to='/signup'>create an account</Link> </p>

                <Form onSubmit={ (e) => { this.handleSignIn(e) }} >
                  <Form.Field>
                    <label>Email</label>
                    <input placeholder='tyrion@.teamdany.com' name='email' value={this.state.email} onChange={ (e) => { this.handleChange(e) } }/>
                  </Form.Field>
                  <Form.Field>
                    <label>Password</label>
                    <input type='password' placeholder='Password' name='password' value={this.state.password} onChange={ (e) => { this.handleChange(e) } } />
                  </Form.Field>

                  <Button primary type='submit' disabled={!this.state.formValid}>Sign In</Button>
                </Form>

                {
                  // display sign up success message
                  (this.props.signUpSuccessMsg.length > 0) ? 
                    <Message positive>
                      {this.props.signUpSuccessMsg}
                    </Message>
                    :
                    ''
                }

                {
                  // display sign in error message
                  (this.props.signInErrorMsg.length > 0) ? 
                    <Message negative>
                      {this.props.signInErrorMsg}
                    </Message>
                    :
                    ''
                }

                <ErrorMessage formErrors={this.state.formErrors} />


              </Grid.Column>

              <Grid.Column width={2}>
                
              </Grid.Column>
            </Grid.Row>
          </Grid>


        </Container>

      </MyContainer>

    );
  }
}

const mapStateToProps = (state) => {
  console.log('mapStateToProps', state);
  return {
    is_authenticated: state.UserReducer.is_authenticated,
    signInErrorMsg: state.UserReducer.signInErrorMsg,
    signUpSuccessMsg: state.UserReducer.signUpSuccessMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    axiosSignIn: (data, router) => { dispatch(axiosSignIn(data, router)); },
    signInErrorClear: () => { dispatch(signInErrorClear()); },
    signUpSuccessClear: () => { dispatch(signUpSuccessClear()); },
  };
};

const connectedSignIn = withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));

export default connectedSignIn;
