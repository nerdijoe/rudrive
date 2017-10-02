import React, { Component } from 'react';
import { Container, Input, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })


  render() {
    const { activeItem } = this.state

    return (
      <Container>
        <Menu secondary>
          <Link to='/'><Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} /></Link>
        <Menu.Menu position='right'>
          <Link to='/signup'><Menu.Item name='signUp' active={activeItem === 'signUp'} onClick={this.handleItemClick} /> </Link>
          <Link to='/signin'><Menu.Item name='signIn' active={activeItem === 'signIn'} onClick={this.handleItemClick} /> </Link>
        </Menu.Menu>
      </Menu>
      </Container>
    );
  }
}

export default Navbar;
