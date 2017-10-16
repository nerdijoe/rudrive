import React, { Component } from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userSignOut } from '../actions';

class Navbar extends Component {
  state = { activeItem: '' }

  handleItemClick = (e, { name }) => {
    console.log('handleItemClick');
    // this.setState({ activeItem: name })
  }

  handleSignOut = () => {
    console.log('handleSignOut this.props.history', this.props.history);
    // this.props.history.push('/signin');
    
    this.props.userSignOut()
  };

  render() {
    const { activeItem } = this.state

    return (
      <Container>
        <Menu secondary>
          {/* <Link to='/'>
            <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
          </Link> */}
        
          { this.props.is_authenticated ? (
            <Menu.Menu position='right'>
              {/* <Link to='/home'>
                <Menu.Item name='files' onClick={this.handleItemClick} />
              </Link>
              <Link to='/home/sharing/folders'>
                <Menu.Item name='sharing' onClick={this.handleItemClick} />
              </Link> */}

              <Link to='/home/about'>
                <Menu.Item name='about' onClick={this.handleItemClick} />
              </Link>
              <Link to='/home/interest'>
                <Menu.Item name='interest' onClick={this.handleItemClick} />
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

const connectedNavbar = withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));

export default connectedNavbar;
