import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import Navbar from './Navbar';

class Landing extends Component {
  render() {
    return (
      <Container>
        <Navbar />
        Yay!
      </Container>
    );
  }
}

export default Landing;
