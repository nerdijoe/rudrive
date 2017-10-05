import React, { Component } from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userSignOut } from '../actions';

class Navbar extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleSignOut = () => this.props.userSignOut();

  render() {
    const { activeItem } = this.state

    return (
      <Container>
        <Menu secondary>
          <Link to='/'>
            <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
          </Link>
        
          { this.props.is_authenticated ? (
            <Menu.Menu position='right'>
              <Link to='/about'>
                <Menu.Item name='about' onClick={this.handleItemClick} />
              </Link>
              <Link to='/'>
                <Menu.Item name='signOut' onClick={this.handleSignOut} />
              </Link>
            </Menu.Menu>
          ) : (
            <Menu.Menu position='right'>

            <Link to='/signup'>
              <Menu.Item name='signUp' active={activeItem === 'signUp'} onClick={this.handleItemClick} />
            </Link>
            <Link to='/signin'>
              <Menu.Item name='signIn' active={activeItem === 'signIn'} onClick={this.handleItemClick} />
            </Link>
            </Menu.Menu>
          )}

      </Menu>
      </Container>  
    );
  }
}

const mapStateToProps = state => {
  return {
    is_authenticated: state.UserReducer.is_authenticated,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    userSignOut: () => { dispatch(userSignOut()) },
  }
};

const connectedNavbar = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default connectedNavbar;
