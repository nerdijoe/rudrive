import React, { Component } from 'react';
import { Container, Form, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { axiosSignIn } from '../actions';

import LandingNavbar from './LandingNavbar';

const styles = {
  customContainer: {
    marginTop: 10,
    marginLeft: 0,
  },
}

const MyContainer = styled.div`
width: 100%;
height: 100%;
margin-left: 0px;
padding: 0px;
${'' /* background: #0099FF; */}

`;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  componentDidMount() {
    if(localStorage.getItem('token') != null) {
      this.props.history.push('/home');
    }
  }

  handleSignIn(e) {
    e.preventDefault();
    console.log('handleSignIn', this.state);

    this.props.axiosSignIn(this.state, this.props.history );

    // if(this.props.is_authenticated) {
    //   this.props.history.push('/home');
    // } else {
    //   alert('Please check your email and password again.');
    // }

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
        <p></p>
        <Container style={styles.customContainer}>


          <Form onSubmit={ (e) => { this.handleSignIn(e) }} >
            <Form.Field>
                <label>Email</label>
                <input placeholder='tyrion@.teamdany.com' name='email' value={this.state.email} onChange={ (e) => { this.handleChange(e) } }/>
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input type='password' placeholder='Password' name='password' value={this.state.password} onChange={ (e) => { this.handleChange(e) } } />
            </Form.Field>

            <Button type='submit'>Sign In</Button>
          </Form>
        </Container>

      </MyContainer>

    );
  }
}

const mapStateToProps = state => {
  console.log('mapStateToProps', state);
  return {
    is_authenticated: state.UserReducer.is_authenticated,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    axiosSignIn: (data, router) => { dispatch(axiosSignIn(data, router)) },
  }
}

const connectedSignIn = withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));

export default connectedSignIn;
