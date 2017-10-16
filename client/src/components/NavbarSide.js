import React, { Component } from 'react';
import {
  Container,
  Menu,
  Header,
} from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userSignOut } from '../actions';

class Navbar extends Component {
  state = { activeItem: 'files' }

  handleItemClick = (e, { name }) => {
    console.log('handleItemClick');
    this.setState({ activeItem: name })
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
        <Menu text vertical>
          <Link to='/'>
            <Menu.Item name='files' active={activeItem === 'files'} onClick={this.handleItemClick} />
          </Link>
        

          <Menu.Item header></Menu.Item>
          <Link to='/home'>
            <Menu.Item name='myFiles' active={activeItem === 'myFiles'} onClick={this.handleItemClick} />
          </Link>
          <Link to='/home/sharing/folders'>
            <Menu.Item name='sharing' active={activeItem === 'sharing'} onClick={this.handleItemClick} />
          </Link>
          <Link to='/home/starred'>
            <Menu.Item name='starred' active={activeItem === 'starred'} onClick={this.handleItemClick} />
          </Link>

          <Link to='/home/activities'>
            <Menu.Item name='activities' active={activeItem === 'activities'} onClick={this.handleItemClick} />
          </Link>


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
