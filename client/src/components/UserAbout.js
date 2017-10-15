import React, { Component } from 'react';
import { Container, Form, Button, Header, TextArea } from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
  axiosFetchUserAbout,
  axiosUpdateUserAbout,
  checkAuthentication,
} from '../actions';

class UserAbout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overview: this.props.about.overview,
      work: this.props.about.work,
      education: this.props.about.education,
      contact_info: this.props.about.contact_info,
      life_events: this.props.about.life_events,
    };
  }

  componentDidMount() {
    this.props.checkAuthentication();
    this.props.axiosFetchUserAbout();
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('handleSubmit this.state=', this.state);
    this.props.axiosUpdateUserAbout(this.state);
  }

  handleChange(e) {
    const target = e.target
    console.log(`handleChange ${target.name}=[${target.value}]`);

    this.setState({
      [target.name]: target.value,
    });
  }

  render() {
    return (
      <Container>
        <Header size="medium">About</Header>

        <Form onSubmit={(e) => { this.handleSubmit(e); }} >
          <Form.Field>
            <label>Overview</label>
            <TextArea placeholder="Tell a little bit about yourself" name="overview" value={this.state.overview} onChange={(e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
            <label>Work</label>
            <input type="text" placeholder="Work History" name="work" value={this.state.work ? this.state.work : ''} onChange={(e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
            <label>Education</label>
            <input type="text" placeholder="Education History" name="education" value={this.state.education ? this.state.education : ''} onChange={(e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
            <label>Contact Info</label>
            <input placeholder="(415)111-2222" name="contact_info" value={this.state.contact_info} onChange={(e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
            <label>Life Events</label>
            <input placeholder="Life events" name="life_events" value={this.state.life_events} onChange={(e) => { this.handleChange(e); }} />
          </Form.Field>

          <Button type="submit">Update</Button>
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

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthentication: () => { dispatch(checkAuthentication()); },
    axiosFetchUserAbout: () => { dispatch(axiosFetchUserAbout()); },
    axiosUpdateUserAbout: (data) => { dispatch(axiosUpdateUserAbout(data)); },
  };
};

const connectedUserAbout = connect(mapStateToProps, mapDispatchToProps)(UserAbout);

export default connectedUserAbout;
