import React, { Component } from 'react';
import { Container, Form, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { axiosSignUp } from '../actions';

import LandingNavbar from './LandingNavbar';

const MyContainer = styled.div`
width: 100%;
height: 100%;
margin-left: -7.5px;
padding: 0px;
${'' /* background: #0099FF; */}

`;

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
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

  handleChange(e) {
    const target = e.target;

    console.log(`handleChange ${target.name}=[${target.value}]`);

    this.setState({
      [target.name]: target.value,
    });
  }

  render() {
    return (
      <MyContainer>
      <LandingNavbar />
      <Container>

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

          <Button type='submit'>Sign In</Button>
        </Form>
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
