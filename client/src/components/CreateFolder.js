import React, { Component } from 'react';
import {
  Container,
  Form,
  Button,
  Input,
  Message,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
  axiosCreateFolder,
  axiosCreateFolderOnCurrentPath,
} from '../actions';

const ErrorMessage = ({formErrors}) => (
  <Container>
    <div></div>
    {Object.keys(formErrors).map((fieldName, i) => {
      if (formErrors[fieldName].length > 0) {
        return (
         
          <Message negative>
            <p key={i}>{fieldName} {formErrors[fieldName]}</p>
          </Message>

        );
      }
    })}
  </Container>
);

class CreateFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: '',
      formErrors: { folderName: '' },
      folderNameValid: false,
      formValid: false,

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

    this.setState({
      folderName: '',
      folderNameValid: false,
      formValid: false,
    });
  }

  validateField(fieldName, value) {
    const formErrorsValidation = this.state.formErrors;
    let folderNameValid = this.state.folderNameValid;

    switch (fieldName) {
      case 'folderName':
        folderNameValid = value.length > 0;
        formErrorsValidation.email = folderNameValid ? '' : ' is blank';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrorsValidation,
      folderNameValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({ formValid: this.state.folderNameValid });
  }


  handleChange(e) {
    const target = e.target;

    this.setState({
      [target.name]: target.value,
    }, () => {
      this.validateField(target.name, target.value);
    });
  }

  render() {
    return (
      <Container>
        <Form onSubmit={(e) => { this.handleSubmit(e); }} >
          <Form.Field>
            <label>Create new folder</label>
            <Input placeholder="new folder" name="folderName" value={this.state.folderName} onChange={(e) => { this.handleChange(e); }} />
          </Form.Field>

          <Button basic color="blue" type="submit" disabled={!this.state.formValid}>Add</Button>
        </Form>
        {/* <ErrorMessage formErrors={this.state.formErrors} /> */}

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
