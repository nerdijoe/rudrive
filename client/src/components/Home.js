import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import FileUpload from './FileUpload';

class Home extends Component {
  render() {
    return (
      <Container>
        Home
        <FileUpload />
      </Container>
    );
  }
}

export default Home;
