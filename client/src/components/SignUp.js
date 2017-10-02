import React, { Component } from 'react';
import { Container, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { axiosSignUp } from '../actions';

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

  handleSignUp() {
    this.props.axiosSignUp(this.state);
  }

  handleChange(stateName, text) {
    this.setState({
      [stateName]: text,
    });
  }

  render() {
    return (
      <Container>
        <Form onSubmit={ (e) => { this.handleSignUp(e) }} >
        <Form.Field>
              <label>First Name</label>
              <input placeholder='John' value={this.state.name} onChangeText={ (text) => { this.handleChange('name', text); }} />
          </Form.Field>
          <Form.Field>
              <label>Last Name</label>
              <input placeholder='Snow' />
          </Form.Field>
          <Form.Field>
              <label>Email</label>
              <input placeholder='john.snow@winterfell.com' />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input placeholder='Password' />
          </Form.Field>

          <Button type='submit'>Sign In</Button>
        </Form>
      </Container>

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
