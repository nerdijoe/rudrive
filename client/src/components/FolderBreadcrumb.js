import React, { Component } from 'react';
import { Container, Icon, Button, Breadcrumb } from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
  axiosFetchRootFolders,
  axiosFetchRootFiles,
  axiosFetchContentsByFolderId,
  axiosFetchContentsByFolderIdBackward,
} from '../actions';

class FolderBreadcrumb extends Component {
  fetchRootContents() {
    console.log('fetchRootContents');
    this.props.axiosFetchRootFolders();
    this.props.axiosFetchRootFiles();
  }

  handleBreadcrumbClick(item) {
    console.log('handleBreadcrumbClick', item);
    this.props.axiosFetchContentsByFolderIdBackward(item);
  }

  render() {

    return (
      <Container>
        <Breadcrumb size='huge'>
          {
            (this.props.breadcrumb.length > 0) ?
              <Breadcrumb.Section link onClick={() => this.fetchRootContents()}>Home</Breadcrumb.Section>
              :
              <Breadcrumb.Section>Home</Breadcrumb.Section>
          }

          {
            this.props.breadcrumb.map( (item, i) => {
              return (
                <span key={item._id}>
                  <Breadcrumb.Divider icon='right chevron' />
                  {
                    (i === this.props.breadcrumb.length - 1) ?
                      <Breadcrumb.Section>{item.name}</Breadcrumb.Section>
                      :
                      <Breadcrumb.Section link onClick={() => this.handleBreadcrumbClick(item)}>{item.name}</Breadcrumb.Section>
                  }
                </span>
              );
            })
          }

          {/* <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section link>Registration</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Personal Information</Breadcrumb.Section> */}
        </Breadcrumb>
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
    axiosFetchRootFolders: () => { dispatch(axiosFetchRootFolders()); },
    axiosFetchRootFiles: () => { dispatch(axiosFetchRootFiles()); },
    axiosFetchContentsByFolderIdBackward: (data) => { dispatch(axiosFetchContentsByFolderIdBackward(data)); },
  };
};

const connectedFolderBreadcrumb = connect(mapStateToProps, mapDispatchToProps)(FolderBreadcrumb);
export default connectedFolderBreadcrumb;
