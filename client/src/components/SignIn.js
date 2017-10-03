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

  handleSignIn(e) {
    e.preventDefault();
    console.log('handleSignIn', this.state);

    this.props.axiosSignIn(this.state);    
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

const mapDispatchToProps = dispatch => {
  return {
    axiosSignIn: (data) => { dispatch(axiosSignIn(data)) },
  }
}

const connectedSignIn = connect(null, mapDispatchToProps)(SignIn);

export default connectedSignIn;
