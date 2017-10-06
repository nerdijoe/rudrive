import React, { Component } from 'react';
import { Container, Table, Icon, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Moment from 'moment';

import { axiosStarFile } from '../actions';

class Listing extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(file) {
    console.log('Listing handleClick', file);
    this.props.axiosStarFile(file);
  }
  render() {
    const listItems = this.props.list.map((item) => <li>{item}</li>);
    const user_id = localStorage.getItem('user_id');
    console.log(`render listing user_id=${user_id}`)
    return (
      <Container>
        Listing
        <ul>{listItems}</ul>

        <Table basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Modified</Table.HeaderCell>
              <Table.HeaderCell>Members</Table.HeaderCell>
              <Table.Cell><Icon name='ellipsis horizontal' /></Table.Cell>

            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.props.files.map( (file) => {
              {/* console.log(Moment(file.updatedAt).format('L LT')); */}

              return (
                <Table.Row key={file.id}>
                  <Table.Cell>
                    {file.name} {' '}
                    {file.is_starred ? <Icon name='blue star' /> : ''}
                  </Table.Cell>
                  <Table.Cell>
                    {Moment(file.updatedAt).format('L LT')}
                  </Table.Cell>
                  <Table.Cell>
                    { (file.user_id == user_id) ? 'Only you' : 'Others'}
                  </Table.Cell>
                  
                  <Table.HeaderCell>
                    <Button basic color="blue" onClick={() => {this.handleClick(file)}}>Star</Button>
                  </Table.HeaderCell>
                </Table.Row>            
              ); // end of return
            })}
          </Table.Body>
        </Table>

      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.UserReducer.list,
    files: state.UserReducer.files,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    axiosStarFile: (data) => { dispatch(axiosStarFile(data)); },
  };
};

const connectedListing = connect(mapStateToProps, mapDispatchToProps)(Listing);

export default connectedListing;
