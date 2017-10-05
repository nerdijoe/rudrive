import React, { Component } from 'react';
import { Container, Form, Button, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

class UserInterest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }


  render() {
    return (
      <Container>
        <Header size='medium'>Interest</Header>
        <Form onSubmit={ (e) => { this.handleSignUp(e) }} >
        <Form.Field>
              <label>Overview</label>
              <input type='text' placeholder='' name='overview' value={this.state.name} onChange={ (e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
              <label>Work</label>
              <input type='text' placeholder='Work History' name='work' value={this.state.name} onChange={ (e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
            <label>Education</label>
            <input type='text' placeholder='Education History' name='education' value={this.state.name} onChange={ (e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
              <label>Contact Info</label>
              <input placeholder='(415)111-2222' name='contact_info' value={this.state.name} onChange={ (e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
            <label>Life Events</label>
            <input placeholder='Life events' name='life_events' value={this.state.name} onChange={ (e) => { this.handleChange(e); }}/>
          </Form.Field>

          <Button type='submit'>Update</Button>
        </Form>
      </Container>

    );
  }
}

const mapStateToProps = state => {
  return {
    about: state.UserReducer.about,
  };
};

const connectedUserInterest = connect(mapStateToProps, null)(UserInterest);
export default connectedUserInterest;
