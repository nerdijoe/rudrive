
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

const should = chai.should();

var server = require('../app');
var db = require('../models');
var User = require('../models/mongoose_user');
var About = require('../models/mongoose_about');
var Interest = require('../models/mongoose_interest');

let passwordHash = require('password-hash');

describe('Auth', () => {

  let token = '';
  let user_id = '';

  let firstname = 'Gordon';
  let lastname = 'Hayward';
  let email = 'gordon@haha.com';
  let password = 'haha';


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
    // User.findByIdAndRemove( user_id, (err, user) => {
    //   done();
    // });
    User.remove({}, (err, res) => {
      done();
    });
  });

  it('POST - /auth/signup - should create a new user', (done) => {
    chai.request(server)
      .post('/auth/signup')
      .send({
        firstname,
        lastname,
        email,
        password,
      }).end((err, result) => {
        console.log('after signed up .......... -> ', result.body);
        result.should.have.status(200);
        result.body.firstname.should.equal(firstname);
        result.body.lastname.should.equal(lastname);
        result.body.email.should.equal(email);
        passwordHash.verify('haha', result.body.password).should.equal(true);
        
        done();
      });
  });

  // const errorMsg = {
  //   message: 'Email is already used. Please sign up using different email.',
  // };

  it('POST - /auth/signup - try to sign up using an email that has already registered should return error message', (done) => {
    chai.request(server)
      .post('/auth/signup')
      .send({
        firstname: 'Foo',
        lastname: 'Bar',
        email: 'rudy@haha.com',
        password: 'lalalala',
      }).end((err, result) => {
        console.log('after signed up .......... -> ', result.body);
        result.should.have.status(200);
        result.body.message.should.equal('Email is already used. Please sign up using different email.');

        done();
      });
  });

  it('POST - /auth/signin - correct credential should let the user sign in', (done) => {
    chai.request(server)
      .post('/auth/signin')
      .send({
        email: 'rudy@haha.com',
        password: 'haha',
      })
      .end((err, result) => {
        // console.log("***** signin", result)
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('object');

        result.body.should.have.property('token');
        result.body.should.have.property('email');
        result.body.email.should.equal('rudy@haha.com');
        done();
      });
  });

  it('POST - /auth/signin - incorrect email and correct password should return status 401', (done) => {
    chai.request(server)
      .post('/auth/signin')
      .send({
        email: 'rudyaaaa@haha.com',
        password: 'haha',
      })
      .end((err, result) => {
        console.log("***** signin incorrect email -> ", result.body)
        result.should.have.status(401);

        done();
      });
  });

  it('POST - /auth/signin - correct email and incorrect password should return status 401', (done) => {
    chai.request(server)
      .post('/auth/signin')
      .send({
        email: 'rudy@haha.com',
        password: 'hahagagaga',
      })
      .end((err, result) => {
        console.log("***** signin incorrect password -> ", result.body)
        result.should.have.status(401);

        done();
      });
  });

}); // end of describe('Auth Sequelize')
