import React, { Component } from 'react';
import { Container, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { axiosUpload } from '../actions';

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
    this.props.axiosUpload(payload);
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

        <input type="file" name="doc" onChange={ e => {this.handleFileUpload(e)} } />


      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    axiosUpload: data => { dispatch(axiosUpload(data)) },
  }
}

const connectedFileUpload = connect(null, mapDispatchToProps)(FileUpload);

export default connectedFileUpload;
