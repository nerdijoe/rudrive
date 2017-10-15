import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Segment,
  Image,
  Button,
  Card,
  Icon,
} from 'semantic-ui-react';
import styled from 'styled-components';

import LandingHeaderMenu from './LandingHeaderMenu';

import LogoCombined from '../assets/images/logo/dropbox_logo_v2.png';

const styles = {
  header: {
    paddingTop: 20,
    // justifyContent: 'center',
  },

};


class LandingNavbar extends Component {
  render() {
    return (
      <Container style={styles.header}>
        <Grid columns='equal'>
          <Grid.Column>
            <Button basic size='tiny'>
              Get Dropbox Basic
            </Button>
          </Grid.Column>
          <Grid.Column width={8} align='center'>
            <Link to='/'>
              <Image src={LogoCombined} shape='rounded' size='small' />
            </Link>
          </Grid.Column>
          <Grid.Column>
            <LandingHeaderMenu />
          </Grid.Column>
        </Grid>
      </Container>

    );
  }
}

export default LandingNavbar;
