import React, { Component } from 'react';
import {
  Container,
  Divider,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import FileUpload from './FileUpload';
import Listing from './Listing';
import CreateFolder from './CreateFolder';

import {
  checkAuthentication,  
  axiosFetchListing,
  axiosFetchUserAbout,
  axiosFetchUserInterest,
  axiosFetchFiles,
  axiosFetchFolders,
  axiosFetchRootFolders,
  axiosFetchRootFiles,
  axiosFetchShareFiles,
  axiosFetchShareFolders,
} from '../actions';

class Home extends Component {
  componentDidMount() {
    this.props.checkAuthentication();
    this.props.axiosFetchListing();
    this.props.axiosFetchUserAbout();
    this.props.axiosFetchUserInterest();
    // this.props.axiosFetchFiles();
    // this.props.axiosFetchFolders();
    this.props.axiosFetchRootFolders();
    this.props.axiosFetchRootFiles();
    this.props.axiosFetchShareFiles();
    this.props.axiosFetchShareFolders();
  }

  render() {
    return (
      <Container>
        <p></p>
        <FileUpload />
        <p></p>
        <CreateFolder />

        <p></p><p></p><p></p>
        <Divider />
        <Listing />
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthentication: () => { dispatch(checkAuthentication()); },
    axiosFetchListing: () => { dispatch(axiosFetchListing()); },
    axiosFetchUserAbout: () => { dispatch(axiosFetchUserAbout()); },
    axiosFetchUserInterest: () => { dispatch(axiosFetchUserInterest()); },
    axiosFetchFiles: () => { dispatch(axiosFetchFiles()); },
    axiosFetchFolders: () => { dispatch(axiosFetchFolders()); },
    axiosFetchRootFolders: () => { dispatch(axiosFetchRootFolders()); },
    axiosFetchRootFiles: () => { dispatch(axiosFetchRootFiles()); },
    axiosFetchShareFiles: () => { dispatch(axiosFetchShareFiles()); },
    axiosFetchShareFolders: () => { dispatch(axiosFetchShareFolders()); },
  };
};

const connectedHome = connect(null, mapDispatchToProps)(Home);
export default connectedHome;
