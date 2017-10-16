import React, { Component } from 'react';
import { } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import styled from 'styled-components';

// import logo from './logo.svg';
// import './App.css';

import store from './store/manageStore';

// import Nav from './components/Navbar';
import Landing from './components/Landing';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
// import About from './components/UserAbout';
// import Interest from './components/UserInterest';
// import Sharing from './components/Sharing';

// const styles = {
//   containerMain: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
    
//     // marginRight: 0,

//   },

// };

const MyContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  ${'' /* background: #0099FF; */}
  
`;


class App extends Component {
  render() {
    return (
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <h1 className="App-title">Welcome to React</h1>
      //   </header>
      //   <p className="App-intro">
      //     To get started, edit <code>src/App.js</code> and save to reload.
      //   </p>
      // </div>

      <Provider store={store}>
        <Router>
          <MyContainer>
            {/* <Nav /> */}

            {/* <Route exact path='/' component={Landing} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/home' component={Home} />
            <Route path='/about' component={About} />
            <Route path='/interest' component={Interest} />
            <Route path='/sharing' component={Sharing} /> */}


            {/* <Landing /> */}
            <Route exact path='/' component={Landing} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/home' component={Home} />
          </MyContainer>
        </Router>
      </Provider>
    );
  }
}

export default App;
