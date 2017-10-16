import React, { Component } from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userSignOut } from '../actions';

class LandingHeaderMenu extends Component {
  state = { activeItem: '' }

  handleItemClick = (e, { name }) => {
    console.log('handleItemClick');
    // this.setState({ activeItem: name })
  }

  handleSignOut = () => this.props.userSignOut();

  render() {
    const { activeItem } = this.state

    return (
      <Container>
        <Menu secondary>

          <Menu.Menu position='right'>
            {/* <Link to='/signup'>
              <Menu.Item name='signUp' active={activeItem === 'signUp'} onClick={this.handleItemClick} />
            </Link> */}
            <Link to='/signin'>
              <Menu.Item name='signIn' active={activeItem === 'signIn'} onClick={this.handleItemClick} />
            </Link>
          </Menu.Menu>

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

const connectedLandingHeaderMenu = connect(mapStateToProps, mapDispatchToProps)(LandingHeaderMenu);

export default connectedLandingHeaderMenu;
