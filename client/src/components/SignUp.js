import React, { Component } from 'react';
import { Container, Form, Button, Message, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { axiosSignUp } from '../actions';

import LandingNavbar from './LandingNavbar';

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

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      formErrors: { firstname: '', lastname: '', email: '', password: '' },
      emailValid: false,
      passwordValid: false,
      firstnameValid: false,
      lastnameValid: false,
      formValid: false,
    };
  }

  componentDidMount() {
    if(localStorage.getItem('token') != null) {
      this.props.history.push('/home');
    }
  }

  handleSignUp(e) {
    e.preventDefault();
    console.log('handleSignUp', this.state);
    this.props.axiosSignUp(this.state);
    this.props.history.push('/');
  }

  validateField(fieldName, value) {
    const formErrorsValidation = this.state.formErrors;
    let firstnameValid = this.state.firstnameValid;
    let lastnameValid = this.state.lastnameValid;
    
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    
    switch (fieldName) {
      case 'firstname':
        firstnameValid = value.length > 0;
        formErrorsValidation.firstname = firstnameValid ? '' : ' is blank. Please enter your first name.';
        break;
      case 'lastname':
        lastnameValid = value.length > 0;
        formErrorsValidation.lastname = lastnameValid ? '' : ' is blank. Please enter your last name.';
        break;
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        formErrorsValidation.email = emailValid ? '' : ' is invalid.';
        break;
      case 'password':
        passwordValid = value.length >= 4;
        formErrorsValidation.password = passwordValid ? '' : ' is too short. Minimum password length is 4 characters.';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrorsValidation,
      firstnameValid,
      lastnameValid,
      emailValid,
      passwordValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({ formValid: this.state.emailValid && this.state.passwordValid && this.state.firstnameValid && this.state.lastnameValid });
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
          <Header as='h3'>Sign up</Header>

          <Form onSubmit={ (e) => { this.handleSignUp(e) }} >
            <Form.Field>
              <label>First Name</label>
              <input placeholder='John' name='firstname' value={this.state.name} onChange={ (e) => { this.handleChange(e); }} />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input placeholder='Snow' name='lastname' value={this.state.name} onChange={ (e) => { this.handleChange(e); }} />
            </Form.Field>
            <Form.Field>
              <label>Email</label>
              <input placeholder='john.snow@winterfell.com' name='email' value={this.state.name} onChange={ (e) => { this.handleChange(e); }} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input type='password' placeholder='Password' name='password' value={this.state.name} onChange={ (e) => { this.handleChange(e); }}/>
            </Form.Field>

            <Button primary type='submit' disabled={!this.state.formValid}>Sign In</Button>
          </Form>

          <ErrorMessage formErrors={this.state.formErrors} />
        </Container>
      </MyContainer>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    axiosSignUp: (data) => { dispatch(axiosSignUp(data)) },
  }
}

const connectedSignUp = connect(null, mapDispatchToProps)(SignUp);

export default connectedSignUp;
