import React, { Component } from 'react';
import {
  Container,
  Divider,
  Image,
  Grid,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Link,
} from 'react-router-dom';

import Nav from './Navbar';
import NavSide from './NavbarSide';
import Files from './Files';
import About from './UserAbout';
import Interest from './UserInterest';
import Sharing from './Sharing';
import Main from './Main';
import Activities from './Activities';

// import FileUpload from './FileUpload';
// import Listing from './Listing';
// import CreateFolder from './CreateFolder';

import Logo from '../assets/images/logo/dropbox_logo.svg';

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
        <p></p><p></p><p></p><p></p>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Image size='mini' src={Logo} />
            </Grid.Column>
            <Grid.Column width={13}>
              <Nav />

            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={3}>
              <NavSide />
            </Grid.Column>
            <Grid.Column width={10}>
              <Route exact path='/home' component={Files} />
              <Route path='/home/about' component={About} />
              <Route path='/home/interest' component={Interest} />
              <Route path='/home/sharing' component={Sharing} />
              <Route path='/home/starred' component={Main} />
              <Route path='/home/activities' component={Activities} />
              
            </Grid.Column>
            <Grid.Column width={3}>
              
            </Grid.Column>
          </Grid.Row>
        </Grid>

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
