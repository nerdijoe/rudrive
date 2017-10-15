import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';

import {
  Container,
  Divider,
} from 'semantic-ui-react';
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
  axiosFetchActivities,
} from '../actions';

class Files extends Component {
  componentDidMount() {
    // if(localStorage.getItem('token') == null) {
    //   this.props.history.push('/');
    // }

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
    this.props.axiosFetchActivities();
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
    axiosFetchActivities: () => { dispatch(axiosFetchActivities()); },
  };
};

const connectedFiles = withRouter(connect(null, mapDispatchToProps)(Files));
export default connectedFiles;

