import React, { Component } from 'react';
import { Container, Input, Menu } from 'semantic-ui-react';

class Navbar extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })


  render() {
    const { activeItem } = this.state

    return (
      <Container>
        (Navbar)

        <Menu secondary>
        <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
        <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
        <Menu.Menu position='right'>
          <Menu.Item name='signIn' active={activeItem === 'signIn'} onClick={this.handleItemClick} />
        </Menu.Menu>
      </Menu>
      </Container>
    );
  }
}

export default Navbar;
