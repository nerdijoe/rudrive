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
  Divider,
  Image,
  Grid,
} from 'semantic-ui-react';

import FolderBreadcrumb from './FolderBreadcrumb';

import {
  axiosStarFile,
  axiosStarFolder,
  axiosDeleteFile,
  axiosDeleteFolder,
  axiosFetchContentsByFolderId,
  axiosFileShareAdd,
  axiosFolderShareAdd,
  axiosFileShareRemove,
  axiosFolderShareRemove,
} from '../actions';

import ProfilePhoto from '../assets/images/ewoks.jpg'


class Listing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      openFolder: false,
      shareUsers: '',
      shareFileId: 0,
      shareFileName: '',
      shareFileUsers: [],
      shareFile: {},
      shareFolderId: 0,
      shareFolderName: '',
      shareFolderUsers: [],
      shareFolder: {},
    }
  }

  // handleRef = component => (this.ref = component);
  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });
  closeFolder = () => this.setState({ openFolder: false });
  
  handleModalShareFileOpen(openValue, file) {
    console.log(`handleModalShareFileOpen openValue=${openValue}, file.id=${file.id}`);
    console.log('file.Users', file.Users);

    this.setState({
      open: openValue,
      shareFileId: file.id,
      shareFileName: file.name,
      shareFileUsers: file.Users,
      shareFile: file,
    });

  }

  handleModalShareFolderOpen(openValue, folder) {
    console.log(`handleModalShareFolderOpen openValue=${openValue}, folder.id=${folder.id}`);
    this.setState({
      openFolder: openValue,
      shareFolderId: folder.id,
      shareFolderName: folder.name,
      shareFolderUsers: folder.Users,
      shareFolder: folder,
    });

  }

  handleClick(file) {
    console.log('Listing handleClick', file);
    this.props.axiosStarFile(file);
  }

  handleDeleteFile(file) {
    console.log('Listing handleDeleteFile', file);
    this.props.axiosDeleteFile(file);
  }

  handleStarFolder(folder) {
    console.log('Listing handleStarFolder', folder);
    this.props.axiosStarFolder(folder);
  }

  handleDeleteFolder(folder) {
    console.log('Listing handleDeleteFolder', folder);
    this.props.axiosDeleteFolder(folder);
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

  handleFolderShareSubmit(e) {
    e.preventDefault();
    console.log(`Modal handleSubmit ${this.state.shareUsers}, ${this.state.shareFolderId}`);

    this.closeFolder();

    this.props.axiosFolderShareAdd(this.state.shareUsers, this.state.shareFolderId)
    this.setState({
      shareUsers: '',
      shareFolderId: 0,
    })
  }


  handleFileShareRemove(user) {
    console.log(`handleFileShareRemove user_id=${user.id}, shareFileId=${this.state.shareFileId}`);
    this.props.axiosFileShareRemove(user, this.state.shareFile);

    // this.close();
    this.setState({
      shareUsers: '',
      // shareFileId: 0,
    })
  }

  handleFolderShareRemove(user) {
    console.log(`handleFolderShareRemove user_id=${user.id}, shareFileId=${this.state.shareFolderId}`);
    this.props.axiosFolderShareRemove(user, this.state.shareFolder);

    // this.closeFolder();
    this.setState({
      shareUsers: '',
      // shareFolderId: 0,
    })
  }



  handleChange(e) {
    const target = e.target;
    // console.log(`handleChange ${target.name}=[${target.value}]`);
    
    this.setState({
      [target.name]: target.value,
    });
  }



  render() {
    // const listItems = this.props.list.map((item) => <li>{item}</li>);
    const user_id = localStorage.getItem('user_id');
    // console.log(`render listing user_id=${user_id}`);
    const user_email = localStorage.getItem('user_email');
    const homeAddress = `http://localhost:3000/`;

    return (
      <Container>
        {/* Listing
        <ul>{listItems}</ul> */}
        <Header as='h2'>Starred</Header>
        <p></p><p></p>
        <FolderBreadcrumb />

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
              this.props.folders.filter(folder => folder.is_starred === true).map( (folder) => {
                // const membersMsg = (folder.Users && folder.Users.length > 0 ) ? `${folder.Users.length} ${(folder.Users.length > 1 ? 'members' : 'member' )}` : 'Only you';

                const membersMsg = (folder.Users && folder.Users.length > 0 ) ? `${folder.Users.length + 1} members` : 'Only you';
                
                let owner = <div>{`${localStorage.getItem('user_firstname')} ${localStorage.getItem('user_lastname')}`}</div>;                
                let members = '';
                if( folder.Users ) {
                  members = folder.Users.map( (item) => {
                    return <div key={item.id}>{`${item.firstname} ${item.lastname}`}</div>;
                  })
                }

                return (
                  <Table.Row key={folder.id}>
                    <Table.Cell>
                      <a onClick={() => {this.handleClickFolder(folder)}}>
                        <Icon name='blue folder' />{folder.name} {' '}
                      </a>
                      {folder.is_starred ? <Icon name='blue star' /> : ''}
                    </Table.Cell>
                    <Table.Cell>
                      {Moment(folder.updatedAt).format('L LT')}
                    </Table.Cell>
                    <Table.Cell>
                      <Popup
                        trigger={<span>{ membersMsg }</span>}
                        content={<span>{ owner }{ members }</span>}
                        size='tiny'
                        position='bottom center'
                        inverted
                      />

                    </Table.Cell>

                    {/* Actions */}
                    <Table.HeaderCell>
                      {/* <Button basic color="blue" onClick={() => {this.handleStarFolder(folder)}}>Star</Button>
                      <Button primary content='Share' onClick={ () => this.handleModalShareFolderOpen(true, folder)} />
                      
                      <Popup
                      trigger={<Button color='red'>Delete</Button>}
                      content={<Button color='green' content='Confirm' onClick={ () => {this.handleDeleteFolder(folder)}}/>}
                      on='click'
                      position='right center'
                    /> */}

                      <Popup wide trigger={<Button basic icon content={<Icon name='ellipsis horizontal'/>} />} position='right center' on='click'>
                        <Grid columns='equal'>
                          <Grid.Column>
                            <Button basic color="blue" onClick={() => {this.handleStarFolder(folder)}}>Star</Button>
                          </Grid.Column>
                          <Grid.Column>
                            <Button primary content='Share' onClick={ () => this.handleModalShareFolderOpen(true, folder)} />
                          </Grid.Column>
                          <Grid.Column>
                          <Popup
                            trigger={<Button color='red'>Delete</Button>}
                            content={<Button color='green' content='Confirm' onClick={ () => {this.handleDeleteFolder(folder)}}/>}
                            on='click'
                            position='top center'
                          />

                          </Grid.Column>
                        </Grid>
                      </Popup>



                    </Table.HeaderCell>
                  </Table.Row>
                ); // end of return
              })}

            { // Files
              this.props.files.filter( file => file.is_starred === true ).map( (file) => {
                let re = new RegExp('./public/')
                const downloadLink = homeAddress + file.full_path.replace(re, '');
                // console.log(downloadLink);

                // const membersMsg = (file.Users && file.Users.length > 0 ) ? `${file.Users.length} ${(file.Users.length > 1 ? 'members' : 'member' )}` : 'Only you';

                const membersMsg = (file.Users && file.Users.length > 0 ) ? `${file.Users.length + 1} members` : 'Only you';
                
                let owner = <div>{`${localStorage.getItem('user_firstname')} ${localStorage.getItem('user_lastname')}`}</div>;
                let members = '';
                if( file.Users ) {
                  members = file.Users.map( (item) => {
                    return <div key={item.id}>{`${item.firstname} ${item.lastname}`}</div>;
                  });
                }

                {/* console.log('$$$ members', members); */}

                
                return (
                  <Table.Row key={file.id}>
                    <Table.Cell>
                      <a href={downloadLink} target="_blank" >{file.name}</a>{' '}
                      {file.is_starred ? <Icon name='blue star' /> : ''}

                    </Table.Cell>
                    <Table.Cell>
                      {Moment(file.updatedAt).format('L LT')}
                    </Table.Cell>
                    <Table.Cell>

                      <Popup
                        trigger={<span>{ membersMsg }</span>}
                        content={<span>{ owner }{ members }</span>}
                        size='tiny'
                        position='bottom center'
                        inverted
                      />
                    </Table.Cell>

                    <Table.HeaderCell>
                      {/* <Button basic color="blue" onClick={() => {this.handleClick(file)}} >Star </Button>
                      <Button primary content='Share' onClick={ () => this.handleModalShareFileOpen(true, file)} />
                      
                      <Popup
                      trigger={<Button color='red'>Delete</Button>}
                      content={<Button color='green' content='Confirm' onClick={ () => {this.handleDeleteFile(file)}}/>}
                      on='click'
                      position='right center'
                    /> */}

                      <Popup wide trigger={<Button basic icon content={<Icon name='ellipsis horizontal'/>} />} position='right center' on='click'>
                          <Grid columns='equal'>
                            <Grid.Column>
                              <Button basic color="blue" onClick={() => {this.handleClick(file)}} >Star </Button>
                            </Grid.Column>
                            <Grid.Column>
                            <Button primary content='Share' onClick={ () => this.handleModalShareFileOpen(true, file)} />
                            </Grid.Column>
                            <Grid.Column>
                            <Popup
                              trigger={<Button color='red'>Delete</Button>}
                              content={<Button color='green' content='Confirm' onClick={ () => {this.handleDeleteFile(file)}}/>}
                              on='click'
                              position='top center'
                            />

                            </Grid.Column>
                          </Grid>
                        </Popup>



                    </Table.HeaderCell>
                  </Table.Row>
                ); // end of return
              })}

          {/* ========================================================================================== */}
            <p></p><p></p><p></p>

            <Header as='h3'>Other files</Header>

            { // Folders
              this.props.folders.filter(folder => folder.is_starred === false).map( (folder) => {
                // const membersMsg = (folder.Users && folder.Users.length > 0 ) ? `${folder.Users.length} ${(folder.Users.length > 1 ? 'members' : 'member' )}` : 'Only you';

                const membersMsg = (folder.Users && folder.Users.length > 0 ) ? `${folder.Users.length + 1} members` : 'Only you';
                
                let owner = <div>{`${localStorage.getItem('user_firstname')} ${localStorage.getItem('user_lastname')}`}</div>;                
                let members = '';
                if( folder.Users ) {
                  members = folder.Users.map( (item) => {
                    return <div key={item.id}>{`${item.firstname} ${item.lastname}`}</div>;
                  })
                }

                return (
                  <Table.Row key={folder.id}>
                    <Table.Cell>
                      <a onClick={() => {this.handleClickFolder(folder)}}>
                        <Icon name='blue folder' />{folder.name} {' '}
                      </a>
                      {folder.is_starred ? <Icon name='blue star' /> : ''}
                    </Table.Cell>
                    <Table.Cell>
                      {Moment(folder.updatedAt).format('L LT')}
                    </Table.Cell>
                    <Table.Cell>
                      <Popup
                        trigger={<span>{ membersMsg }</span>}
                        content={<span>{ owner }{ members }</span>}
                        size='tiny'
                        position='bottom center'
                        inverted
                      />

                    </Table.Cell>

                    {/* Actions */}
                    <Table.HeaderCell>
                      {/* <Button basic color="blue" onClick={() => {this.handleStarFolder(folder)}}>Star</Button>
                      <Button primary content='Share' onClick={ () => this.handleModalShareFolderOpen(true, folder)} />
                      
                      <Popup
                      trigger={<Button color='red'>Delete</Button>}
                      content={<Button color='green' content='Confirm' onClick={ () => {this.handleDeleteFolder(folder)}}/>}
                      on='click'
                      position='right center'
                    /> */}

                      <Popup wide trigger={<Button basic icon content={<Icon name='ellipsis horizontal'/>} />} position='right center' on='click'>
                        <Grid columns='equal'>
                          <Grid.Column>
                            <Button basic color="blue" onClick={() => {this.handleStarFolder(folder)}}>Star</Button>
                          </Grid.Column>
                          <Grid.Column>
                            <Button primary content='Share' onClick={ () => this.handleModalShareFolderOpen(true, folder)} />
                          </Grid.Column>
                          <Grid.Column>
                          <Popup
                            trigger={<Button color='red'>Delete</Button>}
                            content={<Button color='green' content='Confirm' onClick={ () => {this.handleDeleteFolder(folder)}}/>}
                            on='click'
                            position='top center'
                          />

                          </Grid.Column>
                        </Grid>
                      </Popup>



                    </Table.HeaderCell>
                  </Table.Row>
                ); // end of return
              })}

            { // Files
              this.props.files.filter( file => file.is_starred === false ).map( (file) => {
                let re = new RegExp('./public/')
                const downloadLink = homeAddress + file.full_path.replace(re, '');
                // console.log(downloadLink);

                // const membersMsg = (file.Users && file.Users.length > 0 ) ? `${file.Users.length} ${(file.Users.length > 1 ? 'members' : 'member' )}` : 'Only you';

                const membersMsg = (file.Users && file.Users.length > 0 ) ? `${file.Users.length + 1} members` : 'Only you';
                
                let owner = <div>{`${localStorage.getItem('user_firstname')} ${localStorage.getItem('user_lastname')}`}</div>;
                let members = '';
                if( file.Users ) {
                  members = file.Users.map( (item) => {
                    return <div key={item.id}>{`${item.firstname} ${item.lastname}`}</div>;
                  });
                }

                {/* console.log('$$$ members', members); */}

                
                return (
                  <Table.Row key={file.id}>
                    <Table.Cell>
                      <a href={file.aws_s3_path} target="_blank" >{file.name}</a>{' '}
                      {file.is_starred ? <Icon name='blue star' /> : ''}

                    </Table.Cell>
                    <Table.Cell>
                      {Moment(file.updatedAt).format('L LT')}
                    </Table.Cell>
                    <Table.Cell>

                      <Popup
                        trigger={<span>{ membersMsg }</span>}
                        content={<span>{ owner }{ members }</span>}
                        size='tiny'
                        position='bottom center'
                        inverted
                      />
                    </Table.Cell>

                    <Table.HeaderCell>
                      {/* <Button basic color="blue" onClick={() => {this.handleClick(file)}} >Star </Button>
                      <Button primary content='Share' onClick={ () => this.handleModalShareFileOpen(true, file)} />
                      
                      <Popup
                      trigger={<Button color='red'>Delete</Button>}
                      content={<Button color='green' content='Confirm' onClick={ () => {this.handleDeleteFile(file)}}/>}
                      on='click'
                      position='right center'
                    /> */}

                      <Popup wide trigger={<Button basic icon content={<Icon name='ellipsis horizontal'/>} />} position='right center' on='click'>
                          <Grid columns='equal'>
                            <Grid.Column>
                              <Button basic color="blue" onClick={() => {this.handleClick(file)}} >Star </Button>
                            </Grid.Column>
                            <Grid.Column>
                            <Button primary content='Share' onClick={ () => this.handleModalShareFileOpen(true, file)} />
                            </Grid.Column>
                            <Grid.Column>
                            <Popup
                              trigger={<Button color='red'>Delete</Button>}
                              content={<Button color='green' content='Confirm' onClick={ () => {this.handleDeleteFile(file)}}/>}
                              on='click'
                              position='top center'
                            />

                            </Grid.Column>
                          </Grid>
                        </Popup>



                    </Table.HeaderCell>
                  </Table.Row>
                ); // end of return
              })}


          </Table.Body>
        </Table>

        {
          (this.props.folders.length === 0 && this.props.files.length === 0 ) ?
          <Header as='h3' content='This folder is empty' subheader="Please upload some files." /> :
          ''
        }

        {/* File Share Modal */}
        <Modal size='tiny' dimmer='inverted' open={this.state.open} onClose={this.close}>
          <Modal.Content>
            <Form onSubmit={(e) => { this.handleFileShareSubmit(e); }} >
              <Form.Field>
                <Container>
                  <Header size='small'>Share a file</Header>
                  <span>{this.state.shareFileName}</span>
                  <Header size='tiny'>Enter user emails separated by a comma.</Header>
                </Container>
                <Form.Group>
                  <Form.Input width={12} placeholder="harden@rockets.com, cp3@rockets.com, ..." name="shareUsers" value={this.state.shareUsers} onChange={(e) => { this.handleChange(e); }} />
                  <Button basic type="submit">Can view</Button>
                </Form.Group>
                
              </Form.Field>
            </Form>
            <Divider />

            <Table basic='very'>


              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Header as='h4' image>
                      <Image src={ProfilePhoto} shape='rounded' size='mini' />
                      <Header.Content>
                          {localStorage.getItem('user_firstname')} {localStorage.getItem('user_lastname')} 
                        <Header.Subheader>{localStorage.getItem('user_email')}</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>
                      Owner
                  </Table.Cell>
                </Table.Row>

                { this.state.shareFileUsers.map( (user) => {
                return (
                  <Table.Row key={user.id}>
                    <Table.Cell>
                      <Header as='h4' image>
                        <Image src={ProfilePhoto} shape='rounded' size='mini' />
                        <Header.Content>
                            {user.firstname} {user.lastname}
                          <Header.Subheader>{user.email}</Header.Subheader>
                        </Header.Content>
                      </Header>
                    </Table.Cell>
                    <Table.Cell>
                    <Popup
                      trigger={<Button color='red' icon='flask' content='Remove' />}
                      content={<Button color='green' content='Confirm' onClick={ () => {this.handleFileShareRemove(user)}}/>}
                      on='click'
                      position='right center'
                    />
                    </Table.Cell>
                  </Table.Row>

                );
              })
              // end of this.state.shareFileUsers.map()
              }

              </Table.Body>
            </Table>

          </Modal.Content>
        </Modal>

        {/* Folder Share Modal */}
        <Modal size='tiny' dimmer='inverted' open={this.state.openFolder} onClose={this.closeFolder}>
          <Modal.Content>
            <Form onSubmit={(e) => { this.handleFolderShareSubmit(e); }} >
              <Form.Field>
                <Container>
                  <Header size='small'>Share a folder</Header>
                  <span>{this.state.shareFolderName}</span>
                  <Header size='tiny'>Enter user emails separated by a comma.</Header>
                </Container>
                <Form.Group>
                  <Form.Input width={12} placeholder="harden@rockets.com, cp3@rockets.com, ..." name="shareUsers" value={this.state.shareUsers} onChange={(e) => { this.handleChange(e); }} />
                  <Button basic type="submit">Can view</Button>
                </Form.Group>

              </Form.Field>
            </Form>
            <Divider />

            <Table basic='very'>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Header as='h4' image>
                      <Image src={ProfilePhoto} shape='rounded' size='mini' />
                      <Header.Content>
                          {localStorage.getItem('user_firstname')} {localStorage.getItem('user_lastname')} 
                        <Header.Subheader>{localStorage.getItem('user_email')}</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>
                      Owner
                  </Table.Cell>
                </Table.Row>

                { this.state.shareFolderUsers.map( (user) => {
                return (
                  <Table.Row key={user.id}>
                    <Table.Cell>
                      <Header as='h4' image>
                        <Image src={ProfilePhoto} shape='rounded' size='mini' />
                        <Header.Content>
                            {user.firstname} {user.lastname}
                          <Header.Subheader>{user.email}</Header.Subheader>
                        </Header.Content>
                      </Header>
                    </Table.Cell>
                    <Table.Cell>
                    <Popup
                      trigger={<Button color='red' icon='flask' content='Remove' />}
                      content={<Button color='green' content='Confirm' onClick={ () => {this.handleFolderShareRemove(user)}}/>}
                      on='click'
                      position='right center'
                    />
                    </Table.Cell>
                  </Table.Row>

                );
              })
              // end of this.state.shareFileUsers.map()
              }

              </Table.Body>
            </Table>


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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    axiosStarFile: (data) => { dispatch(axiosStarFile(data)); },
    axiosDeleteFile: (data) => { dispatch(axiosDeleteFile(data)); },
    axiosStarFolder: (data) => { dispatch(axiosStarFolder(data)); },
    axiosDeleteFolder: (data) => { dispatch(axiosDeleteFolder(data)); },
    axiosFetchContentsByFolderId: (data) => { dispatch(axiosFetchContentsByFolderId(data)); },
    axiosFileShareAdd: (users, file_id) => { dispatch(axiosFileShareAdd(users, file_id)); },
    axiosFolderShareAdd: (users, folder_id) => { dispatch(axiosFolderShareAdd(users, folder_id)); },
    axiosFileShareRemove: (user, file) => { dispatch(axiosFileShareRemove(user, file));},
    axiosFolderShareRemove: (user, folder) => { dispatch(axiosFolderShareRemove(user, folder));},
  };
};

const connectedListing = connect(mapStateToProps, mapDispatchToProps)(Listing);

export default connectedListing;
