import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import FileUpload from './FileUpload';
import Listing from './Listing';
import CreateFolder from './CreateFolder';

import { 
  axiosFetchListing,
  axiosFetchUserAbout,
} from '../actions';

class Home extends Component {

  componentDidMount() {
    this.props.axiosFetchListing();
    this.props.axiosFetchUserAbout();
  }

  render() {
    return (
      <Container>
        Home
        <FileUpload />
        <CreateFolder />

        <Listing />
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    axiosFetchListing: () => { dispatch(axiosFetchListing()) },
    axiosFetchUserAbout: () => { dispatch(axiosFetchUserAbout()) },
  };
};

const connectedHome = connect(null, mapDispatchToProps)(Home);
export default connectedHome;
