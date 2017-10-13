import React, { Component } from 'react';
import { Container, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { axiosSignIn } from '../actions';

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
      <Container>
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

const connectedSignIn = connect(mapStateToProps, mapDispatchToProps)(SignIn);

export default connectedSignIn;
