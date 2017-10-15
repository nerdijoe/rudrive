import React, { Component } from 'react';
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

import LandingNavbar from './LandingNavbar';

import BannerBusiness from '../assets/images/banner/banner_business_background.jpg';

const styles = {
  containerMain: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#F0F0F0',
    // marginRight: 0,

  },
  container: {
    backgroundColor: '#F0F0F0',
    flex: 1,
    // justifyContent: 'center',
  },
  buttonBanner: {
    marginLeft: 10,

  },
  centered: {
    margin: 'auto',
    flex: 1,

  },
  header: {
    paddingTop: 20,
    // justifyContent: 'center',
  },

};

const MyContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  ${'' /* background: #0099FF; */}

`;


const BannerWrapper = styled.div`
  width: 100%;
  ${'' /* background: #0099FF; */}
  ${'' /* padding: 10px; */}
  margin-top: 10px;
`;

const Banner = styled.div`
  margin: auto;
  padding-top: 50px;
  padding-bottom: 150px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  // border-top: 1px solid #0099FF;
  background: #e3eefc;
  background-repeat: no-repeat;
  background-image: url(${BannerBusiness});
  background-position: right center;
  background-size: contain;
`;

const BannerText = styled.div`
  ${'' /* margin: auto; */}
  font-size: 3em;
  text-align: left;
  margin-left: 10px;
  font-weight: 100;
  color: black;
  ${'' /* max-width: 700px; */}
  padding-top: 120px;
  padding-bottom: 20px;
`;

const BannerTextSub = styled.div`
  ${'' /* margin: auto; */}
  font-size: 150%;
  text-align: left;
  margin-left: 10px;
  font-weight: 100;
  color: #474747;
  max-width: 700px;
  padding-top: 20px;
  padding-bottom: 40px;
`;

const InfoWrapper = styled.div`
margin: auto;
background: #0099FF;
flex: 1;
justifyContent: 'center';
`;

const Applet = styled.div`
  display: inline-block;
  border-radius: 10px;
  padding: 20px;
  width: 140px;
  height: 200px;
  margin: 5px;
  background: #EFDC05;
`;

class LandingMain extends Component {
  render() {
    return (
      <div>
        {/* <LandingNavbar /> */}
        <BannerWrapper>
        <Banner>
            <Container>
              <BannerText>
              Boost productivity
                <br/><br/><br/>
              with Dropbox Business
              </BannerText>
              <BannerTextSub>
                The secure file sharing and storage solution
                <br/><br/>
                that employees and IT admins trust.
              </BannerTextSub>
              
              <Button primary size='huge' style={styles.buttonBanner}>
                Try Dropbox Now
              </Button>

              <Button primary basic size='huge' style={styles.buttonBanner}>
                Get Dropbox Basic
              </Button>
            </Container>
          </Banner>

        </BannerWrapper>

        <InfoWrapper>
{/*         
          <Grid columns='equal'>
            <Grid.Column>
              <Applet>
                <span>test</span>
              </Applet>
            </Grid.Column>
            <Grid.Column>
              <Applet>
                <span>2</span>
              </Applet>
            </Grid.Column>
            <Grid.Column>
              <Applet>
                <span>3</span>
              </Applet>
            </Grid.Column>
          </Grid>

          <Card>
            <Card.Content header='About Amy' />
            <Card.Content description='bro' />
            <Card.Content extra>
              <Icon name='user' />
              4 Friends
            </Card.Content>
          </Card> */}
        </InfoWrapper>
      </div>
    );
  }
}

export default LandingMain;
