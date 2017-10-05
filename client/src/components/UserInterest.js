import React, { Component } from 'react';
import { Container, Form, Button, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { axiosUpdateUserInterest } from '../actions';

class UserInterest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      music: this.props.interest.music,
      shows: this.props.interest.shows,
      sports: this.props.interest.sports,
      fav_teams: this.props.interest.fav_teams,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('handleSubmit this.state=', this.state);
    this.props.axiosUpdateUserInterest(this.state);
  }

  handleChange(e) {
    const target = e.target
    console.log(`handleChange ${target.name}=[${target.value}]`);

    this.setState({
      [target.name]: target.value,
    });
  }


  render() {
    return (
      <Container>
        <Header size='medium'>Interest</Header>
        <Form onSubmit={ (e) => { this.handleSubmit(e) }} >
        <Form.Field>
              <label>Music</label>
              <input type='text' placeholder='' name='music' value={this.state.music} onChange={ (e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
              <label>Shows</label>
              <input type='text' placeholder='Shows' name='shows' value={this.state.shows} onChange={ (e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
            <label>Sports</label>
            <input type='text' placeholder='Sports' name='sports' value={this.state.sports} onChange={ (e) => { this.handleChange(e); }} />
          </Form.Field>
          <Form.Field>
              <label>Favorite Teams</label>
              <input placeholder='Teams' name='fav_teams' value={this.state.fav_teams} onChange={ (e) => { this.handleChange(e); }} />
          </Form.Field>

          <Button type='submit'>Update</Button>
        </Form>
      </Container>

    );
  }
}

const mapStateToProps = state => {
  return {
    interest: state.UserReducer.interest,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    axiosUpdateUserInterest: (data) => { dispatch(axiosUpdateUserInterest(data)); },
  }
};

const connectedUserInterest = connect(mapStateToProps, mapDispatchToProps)(UserInterest);
export default connectedUserInterest;
