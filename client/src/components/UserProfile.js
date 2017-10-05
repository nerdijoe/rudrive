import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import About from './UserAbout';
import Interest from './UserInterest';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }

  }
  render() {
    return (
      <Container>
        Profile
        <About />
        <Interest />

      </Container>
    );
  }
}

export default UserProfile;
