import React, { Component } from 'react';
import { Container, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
  axiosCreateFolder,
  axiosCreateFolderOnCurrentPath,
} from '../actions';

class CreateFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: '',
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('handleSubmit', this.folderName);

    
    // this.props.axio CreateFolder(this.state);

    const email = localStorage.getItem('user_email');
    let currentPath = `./public/uploads/${email}`;
    if (this.props.breadcrumb.length > 0) {
      const pos = this.props.breadcrumb.length - 1;
      currentPath = this.props.breadcrumb[pos].full_path;
    }

    this.props.axiosCreateFolderOnCurrentPath(this.state, currentPath);
  }

  handleChange(e) {
    const target = e.target;

    this.setState({
      [target.name]: target.value,
    });
  }

  render() {
    return (
      <Container>
        <Form onSubmit={(e) => { this.handleSubmit(e); }} >
          <Form.Field>
            <label>New Folder</label>
            <input placeholder="" name="folderName" value={this.state.folderName} onChange={(e) => { this.handleChange(e); }} />
          </Form.Field>

          <Button type="submit">Add</Button>
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    breadcrumb: state.UserReducer.breadcrumb,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    axiosCreateFolder: (data) => { dispatch(axiosCreateFolder(data)); },
    axiosCreateFolderOnCurrentPath: (data, currentpath) => { dispatch(axiosCreateFolderOnCurrentPath(data, currentpath)); },
  };
};

const connectedCreateFolder = connect(mapStateToProps, mapDispatchToProps)(CreateFolder);

export default connectedCreateFolder;
