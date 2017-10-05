import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import FileUpload from './FileUpload';
import Listing from './Listing';
import CreateFolder from './CreateFolder';

import { 
  axiosFetchListing,
  axiosFetchUserAbout,
  axiosFetchUserInterest,
} from '../actions';

class Home extends Component {
  componentDidMount() {
    this.props.axiosFetchListing();
    this.props.axiosFetchUserAbout();
    this.props.axiosFetchUserInterest();
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
    axiosFetchUserInterest: () => { dispatch(axiosFetchUserInterest()) },
  };
};

const connectedHome = connect(null, mapDispatchToProps)(Home);
export default connectedHome;
