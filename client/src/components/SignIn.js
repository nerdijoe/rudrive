import React, { Component } from 'react';
import { Container, Form, Button } from 'semantic-ui-react';

class SignIn extends Component {
  render() {
    return (
      <Container>
        <Form>
          <Form.Field>
              <label>Email</label>
              <input placeholder='user@email.com' />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input placeholder='Last Name' />
          </Form.Field>

          <Button type='submit'>Sign In</Button>
        </Form>
      </Container>
    );
  }
}

export default SignIn;
