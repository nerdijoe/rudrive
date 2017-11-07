var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

const should = chai.should();

var server = require('../app');
var db = require('../models');
const User = require('../models/mongoose_user');
const About = require('../models/mongoose_about');
const Interest = require('../models/mongoose_interest');

let passwordHash = require('password-hash');

describe('User', () => {

  let token = '';
  let user_id = '';

  beforeEach((done) => {
    const newUser = User({
      firstname: 'Rudy',
      lastname: 'W',
      email: 'rudy@haha.com',
      password: passwordHash.generate('haha'),
    });

    newUser.save((err, user) => {
      // newUser_id = user._id;
      user_id = user._id


      const newAbout = About({
        overview: '',
        work: '',
        education: '',
        contact_info: '',
        life_events: '',
        user: user._id,
      });

      newAbout.save((err3, about) => {
        const newInterest = Interest({
          music: '',
          shows: '',
          sports: '',
          fav_teams: '',
          user: user._id,
        });
        newInterest.save((err4, interest) => {
          chai.request(server)
            .post('/auth/signin')
            .send({
              email: 'rudy@haha.com',
              password: 'haha',
            })
            .end((err, result) => {
              console.log('****** result.body=', result.body);
              token = result.body.token;
              done();
            });
        });
      });
    });
  }); // end of beforeEach

  afterEach((done) => {
    User.findByIdAndRemove( user_id, (err, user) => {
      done();
    });
  });

  // user has signed in and use the token to access server API
  it('GET - /users/about - should return user about', (done) => {
    chai.request(server)
      .get('/users/about')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get user about", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('object');

        result.body.should.have.property('overview');
        result.body.should.have.property('work');
        result.body.should.have.property('education');
        result.body.should.have.property('contact_info');
        result.body.should.have.property('life_events');

        done();
      });
  });

  it('GET - /users/interest - should return user about', (done) => {
    chai.request(server)
      .get('/users/interest')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get user interest", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('object');

        result.body.should.have.property('music');
        result.body.should.have.property('shows');
        result.body.should.have.property('sports');
        result.body.should.have.property('fav_teams');

        done();
      });
  });

  it('GET - /users/activities - should return user activities', (done) => {
    chai.request(server)
      .get('/users/activities')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get user activities", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('array');
        result.body.length.should.equal(0);

        done();
      });
  });


  it('POST - /users/activities - insert user activity: signing in', (done) => {
    let action = 'USER_SIGN_IN';
    let description = 'User sign in';
    chai.request(server)
      .post('/users/activities')
      .set('token', token)
      .send({
        action,
        description
      })
      .end((err, result) => {
        console.log("*** insert user activity", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.action.should.equal(action);
        result.body.description.should.equal(description);

        done();
      });
  });


  it('PUT - /users/interest - should update user interest', (done) => {
    let music = 'the 5 6 7 8';
    let shows = 'curb';
    let sports = 'football';
    let fav_teams = 'nygiants';

    chai.request(server)
      .put('/users/interest')
      .set('token', token)
      .send({
        music,
        shows,
        sports,
        fav_teams,
      })
      .end((err, result) => {
        console.log("*** update user interest", result.body);

        chai.request(server)
          .get('/users/interest')
          .set('token', token)
          .end((err, result) => {
            console.log("*** get user interest after update", result.body);
            result.should.have.status(200);
            result.should.be.an('object');
            result.body.should.be.an('object');

            result.body.should.have.property('music');
            result.body.should.have.property('shows');
            result.body.should.have.property('sports');
            result.body.should.have.property('fav_teams');

            result.body.music.should.equal(music);

            done();
          });
      });
  });

  it('PUT - /users/about - should update user about', (done) => {
    let overview = 'fighter';
    let work = 'developer';
    let education = 'sjsu';
    let contact_info = '3434 434 434 43';
    let life_events = 'graduated'

    chai.request(server)
      .put('/users/about')
      .set('token', token)
      .send({
        overview,
        work,
        education,
        contact_info,
        life_events,
      })
      .end((err, result) => {
        console.log("*** update user about", result.body);

        chai.request(server)
          .get('/users/about')
          .set('token', token)
          .end((err, result) => {
            console.log("*** get user about after update", result.body);
            result.should.have.status(200);
            result.should.be.an('object');
            result.body.should.be.an('object');

            result.body.should.have.property('overview');
            result.body.should.have.property('work');
            result.body.should.have.property('education');
            result.body.should.have.property('contact_info');
            result.body.should.have.property('life_events');

            result.body.overview.should.equal(overview);
            result.body.work.should.equal(work);
            result.body.education.should.equal(education);
            result.body.contact_info.should.equal(contact_info);
            result.body.life_events.should.equal(life_events);

            done();
          });
      });
  });
});
