import React, { Component } from 'react';
import { Container, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { axiosCreateFolder } from '../actions';

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

    this.props.axiosCreateFolder(this.state);
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

const mapDispatchToProps = dispatch => {
  return {
    axiosCreateFolder: (data) => { dispatch(axiosCreateFolder(data)); },
  };
};

const connectedCreateFolder = connect(null, mapDispatchToProps)(CreateFolder);

export default connectedCreateFolder;
