import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import {

} from 'semantic-ui-react';
import styled from 'styled-components';

import LandingNavbar from './LandingNavbar';
// import LandingHeaderMenu from './LandingHeaderMenu';
import LandingMain from './LandingMain';
// import SignIn from './SignIn';
// import SignUp from './SignUp';

// import Logo from '../assets/images/logo/dropbox_logo.svg';
// import LogoText from '../assets/images/logo/dropbox_logo_text.svg';
// import LogoCombined from '../assets/images/logo/dropbox_logo_v2.png';
import BannerBusiness from '../assets/images/banner/banner_business_background.jpg';

// const styles = {
//   containerMain: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     backgroundColor: '#F0F0F0',
//     // marginRight: 0,

//   },
//   container: {
//     backgroundColor: '#F0F0F0',
//     flex: 1,
//     // justifyContent: 'center',
//   },
//   buttonBanner: {
//     marginLeft: 10,

//   },
//   centered: {
//     margin: 'auto',
//     flex: 1,

//   },
//   header: {
//     paddingTop: 20,
//     // justifyContent: 'center',
//   },

// };

const MyContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  ${'' /* background: #0099FF; */}

`;

class Landing extends Component {
  componentDidMount() {
    if(localStorage.getItem('token') != null) {
      this.props.history.push('/home');
    }
  }

  render() {
    return (

        <MyContainer>

          <LandingNavbar />

          <LandingMain/>

          {/* <Route exact path='/' component={LandingMain} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} /> */}


        </MyContainer>

    );
  }
}

export default Landing;
