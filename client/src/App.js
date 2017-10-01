import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import Nav from './components/Navbar';
import Landing from './components/Landing';
import SignIn from './components/SignIn';

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
      <Router>
        <Container>
          <Nav />
          
          <Route exact path='/' component={Landing} />
          <Route path='/signin' component={SignIn} />
          
        </Container>
      </Router>
    );
  }
}

export default App;
