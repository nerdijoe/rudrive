import React, { Component } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';

import {
  Container,
  Table,
  Icon,
  Button,
  Header,
  Modal,
  Input,
  Form,
  Popup,
  Menu,
} from 'semantic-ui-react';

import FolderBreadcrumb from './FolderBreadcrumb';

import SharingFiles from './SharingFiles';
import SharingFolders from './SharingFolders';

import {
  axiosStarFile,
  axiosStarFolder,
  axiosFetchContentsByFolderId,
  axiosFileShareAdd,
} from '../actions';

class Listing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'folders',
      open: false,
      shareUsers: '',
      shareFileId: 0,
      shareFileName: '',
    }
  }

  componentDidMount() {

  }
  

  // handleRef = component => (this.ref = component);
  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  handleModalShareFileOpen(openValue, file) {
    console.log(`handleModalShareFileOpen openValue=${openValue}, file.id=${file.id}`);
    this.setState({
      open: openValue,
      shareFileId: file.id,
      shareFileName: file.name,
    });

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

  openInNewTab(url) {
    // e.preventDefault();
    var win = window.open(url, '_blank');
    win.focus();
    console.log('openInNewTab', url)
  }

  // Modal
  handleFileShareSubmit(e) {
    e.preventDefault();
    console.log(`Modal handleSubmit ${this.state.shareUsers}, ${this.state.shareFileId}`);



    this.close();

    this.props.axiosFileShareAdd(this.state.shareUsers, this.state.shareFileId)
    this.setState({
      shareUsers: '',
      shareFileId: 0,
    })
  }

  handleChange(e) {
    const target = e.target;
    console.log(`handleChange ${target.name}=[${target.value}]`);
    
    this.setState({
      [target.name]: target.value,
    });
  }

  // for menu
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
  render() {
    const listItems = this.props.list.map((item) => <li>{item}</li>);
    const user_id = localStorage.getItem('user_id');
    // console.log(`render listing user_id=${user_id}`);
    const user_email = localStorage.getItem('user_email');
    const homeAddress = `http://localhost:3000/`;

    // for menu
    const { activeItem } = this.state
    
    return (
      <Container>
        {/* Listing
        <ul>{listItems}</ul> */}


        {/* <FolderBreadcrumb /> */}

        <Header as='h5'>Shared files let you collaborate on individual files. When someone shares a file with you, you’ll have private view-only access to that file.</Header>


        <Table basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Modified</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>

            { // Files
              this.props.shareFiles.map( (file) => {
                let re = new RegExp('./public/')
                const downloadLink = homeAddress + file.full_path.replace(re, '');
                // console.log(downloadLink);

                
                return (
                  <Table.Row key={file.id}>
                    <Table.Cell>
                      <a href={file.aws_s3_path} target="_blank" >{file.name}</a>{' '}
                      

                    </Table.Cell>
                    <Table.Cell>
                      {/* {Moment(file.FileSharing.updatedAt).format('L LT')} */}
                    </Table.Cell>

                  </Table.Row>
                ); // end of return
              })}

          </Table.Body>
        </Table>

        {
          (this.props.shareFiles.length === 0 ) ?
          <Header as='h3' content='This folder is empty' subheader="Please upload some files." /> :
          ''
        }

        <Modal dimmer='inverted' open={this.state.open} onClose={this.close}>
          <Modal.Content>
            <Form onSubmit={(e) => { this.handleFileShareSubmit(e); }} >
              <Form.Field>
                <Container>
                  <Header sub>Share a file</Header>
                  <span>{this.state.shareFileName}</span>
                  <Header size='tiny'>Share with other users, Enter user emails separated by a comma.</Header>
                </Container>
                <Input placeholder="harden@rockets.com, cp3@rockets.com, ..." name="shareUsers" value={this.state.shareUsers} onChange={(e) => { this.handleChange(e); }} />
              </Form.Field>
              <Button basic type="submit">Can view</Button>
            </Form>
          </Modal.Content>
        </Modal>


      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.UserReducer.list,
    files: state.UserReducer.files,
    folders: state.UserReducer.folders,
    shareFiles: state.UserReducer.shareFiles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    axiosStarFile: (data) => { dispatch(axiosStarFile(data)); },
    axiosStarFolder: (data) => { dispatch(axiosStarFolder(data)); },
    axiosFetchContentsByFolderId: (data) => { dispatch(axiosFetchContentsByFolderId(data)); },
    axiosFileShareAdd: (users, file_id) => { dispatch(axiosFileShareAdd(users, file_id)); },
  };
};

const connectedListing = connect(mapStateToProps, mapDispatchToProps)(Listing);

export default connectedListing;
