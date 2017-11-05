var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

const should = chai.should();

var server = require('../app');
var db = require('../models');
const User = require('../models/mongoose_user');

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
        result.body.should.have.property('work_edu');
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
});
