import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import Moment from 'moment';

import {
  Container,
  Divider,
  Table,
  Icon,
  Header,
} from 'semantic-ui-react';

class Activities extends Component {
  render() {
    return (
      <Container>
        <Header as='h2'>Activities</Header>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='4'>Total Activities: {this.props.activities.length}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>

            {
              this.props.activities.map((a, i) => {
                return (
                  <Table.Row key={a.id}>
                    <Table.Cell>{i+1}</Table.Cell>
                    <Table.Cell>
                      {a.action}
                    </Table.Cell>
                    <Table.Cell>{a.description}</Table.Cell>
                    <Table.Cell textAlign='right'>{Moment(a.createdAt).format('L LT')}</Table.Cell>
                  </Table.Row>
                );
              })
            }

          </Table.Body>
        </Table>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activities: state.UserReducer.activities,
  };
};

const connectedActivities = connect(mapStateToProps, null)(Activities);

export default connectedActivities;
