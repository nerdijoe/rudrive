import React, { Component } from 'react';
import {
  Container,
  Divider,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';

import Nav from './Navbar';
import Files from './Files';
import About from './UserAbout';
import Interest from './UserInterest';
import Sharing from './Sharing';

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
    if(localStorage.getItem('token') == null) {
      this.props.history.push('/');
    }
  
    // this.props.checkAuthentication();
    // this.props.axiosFetchListing();
    // this.props.axiosFetchUserAbout();
    // this.props.axiosFetchUserInterest();
    // // this.props.axiosFetchFiles();
    // // this.props.axiosFetchFolders();
    // this.props.axiosFetchRootFolders();
    // this.props.axiosFetchRootFiles();
    // this.props.axiosFetchShareFiles();
    // this.props.axiosFetchShareFolders();
  }

  render() {
    return (

        <Container>
          <Nav />
        
          <Route exact path='/home' component={Files} />
          <Route path='/home/about' component={About} />
          <Route path='/home/interest' component={Interest} />
          <Route path='/home/sharing' component={Sharing} />

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

const connectedHome = withRouter(connect(null, mapDispatchToProps)(Home));
export default connectedHome;
