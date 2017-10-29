import React, { Component } from 'react';
import {
  Container,
  Form,
  Button,
  Input,
  Icon,
  Label,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
  axiosUpload,
  axiosUploadToPath,
} from '../actions';

const styles = {
  myinput: {
    display: 'none',
  },
  blue: {
    background: '#0070E0',
    color: 'white',
  }
};

class FileUpload extends Component {

  handleSubmit(e) {
    e.preventDefault();
    console.log('*** handleSubmit');
    console.log('e.target.file', e.target.file);

    const data = new FormData();
    
    data.append('file', e.target.file);
    data.append('name', 'test file');
    data.append('description', 'file description');

    this.props.axiosUpload(data);
  }

  handleFileUpload(e) {
    const payload = new FormData();

    payload.append('doc', e.target.files[0]);
    console.log('payload ---->', payload);
    // this.props.axiosUpload(payload);

    // upload to path
    const email = localStorage.getItem('user_email');
    let currentPath = 0;
    if (this.props.breadcrumb.length > 0) {
      const pos = this.props.breadcrumb.length - 1;
      currentPath = this.props.breadcrumb[pos]._id;
    }
    this.props.axiosUploadToPath(payload, currentPath);
  }

  render() {
    return (
      <Container>
        {/* <Form
          encType="multipart/form-data"
          onSubmit={(e) => { this.handleSubmit(e); }}
        >

          <Form.Field>
            <label>File</label>
            <input type='file' placeholder='file' name='doc' />
          </Form.Field>

          <Button type='submit'>Upload</Button>
        </Form> */}
        <div>
          <label for="file" class="ui icon button" style={styles.blue}>
            <Icon name='cloud upload' /><span>  </span>
            Upload a file
          </label>
          <Input type="file" name="doc" id="file" style={styles.myinput} onChange={(e) => { this.handleFileUpload(e); }} />
        </div>

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
    axiosUpload: (data) => { dispatch(axiosUpload(data)); },
    axiosUploadToPath: (data, currentPath) => { dispatch(axiosUploadToPath(data, currentPath)); },
  }
}

const connectedFileUpload = connect(mapStateToProps, mapDispatchToProps)(FileUpload);

export default connectedFileUpload;
