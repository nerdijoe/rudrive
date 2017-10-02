import React, { Component } from 'react';
import { Container, Form, Button } from 'semantic-ui-react';

class SignUp extends Component {
  render() {
    return (
      <Container>
        <Form>
        <Form.Field>
              <label>First Name</label>
              <input placeholder='John' />
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

export default SignUp;
