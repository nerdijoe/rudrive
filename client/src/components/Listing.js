import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

class Listing extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const listItems = this.props.list.map((item) =>
    <li>{item}</li>
    );

    return (
      <Container>
        Listing
        <ul>{listItems}</ul>
      </Container>
    );
  }
}

const mapStateToDispatch = state => {
  return {
    list: state.UserReducer.list,
  }
}

const connectedHome = connect(mapStateToDispatch, null)(Listing);

export default connectedHome;
