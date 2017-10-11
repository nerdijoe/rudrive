import React, { Component } from 'react';
import { Container, Table, Icon, Button, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Moment from 'moment';

import FolderBreadcrumb from './FolderBreadcrumb';

import {
  axiosStarFile,
  axiosStarFolder,
  axiosFetchContentsByFolderId,
} from '../actions';

class Listing extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(file) {
    console.log('Listing handleClick', file);
    this.props.axiosStarFile(file);
  }

  handleStarFolder(folder) {
    console.log('Listing handleStarFolder', folder);
    this.props.axiosStarFolder(folder);
  }

  handleClickFolder(folder) {
    console.log('Listing handleClickFolder', folder);
    this.props.axiosFetchContentsByFolderId(folder);
  }

  render() {
    const listItems = this.props.list.map((item) => <li>{item}</li>);
    const user_id = localStorage.getItem('user_id');
    console.log(`render listing user_id=${user_id}`)
    return (
      <Container>
        Listing
        <ul>{listItems}</ul>

        <FolderBreadcrumb />

        {
          (this.props.folders.length === 0 && this.props.files.length === 0 ) ?
          <Header as='h3' content='This folder is empty' subheader="Please upload some files." /> :
          ''
        }

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
            { // Folders
              this.props.folders.map( (folder) => {

                return (
                  <Table.Row key={folder.id}>
                    <Table.Cell>
                      <Icon name='blue folder' />{folder.name} {' '}
                      {folder.is_starred ? <Icon name='blue star' /> : ''}
                      <a class="item" onClick={() => {this.handleClickFolder(folder)}}>test</a>
                    </Table.Cell>
                    <Table.Cell>
                      {Moment(folder.updatedAt).format('L LT')}
                    </Table.Cell>
                    <Table.Cell>
                      { (folder.user_id == user_id) ? 'Only you' : 'Others'}
                    </Table.Cell>

                    <Table.HeaderCell>
                      <Button basic color="blue" onClick={() => {this.handleStarFolder(folder)}}>Star</Button>
                    </Table.HeaderCell>
                  </Table.Row>
                ); // end of return
              })}

            { // Files
              this.props.files.map( (file) => {
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
    folders: state.UserReducer.folders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    axiosStarFile: (data) => { dispatch(axiosStarFile(data)); },
    axiosStarFolder: (data) => { dispatch(axiosStarFolder(data)); },
    axiosFetchContentsByFolderId: (data) => { dispatch(axiosFetchContentsByFolderId(data)); },
  };
};

const connectedListing = connect(mapStateToProps, mapDispatchToProps)(Listing);

export default connectedListing;
