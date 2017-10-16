
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

const should = chai.should();

var server = require('../app');
var db = require('../models');
let passwordHash = require('password-hash');

describe('Auth Sequelize', () => {

  beforeEach( (done) => {
    const newUser = {
      firstname: 'rudy',
      lastname: 'w',
      email: 'rudy@haha.com',
      password: 'sha1$6f85ce31$1$7936552d15684ac319e4d222a99f1ab871174db0',
    };

    db.User.create(newUser)
      .then((user) => {
        newUser_id = user.id;
        done();
      });
  });

  afterEach((done) => {
    db.User.destroy({where: {}})
      .then(() => {
        done();
      });
  });

  it('POST - /authseq/signup - should create a new user', (done) => {
    chai.request(server)
      .post('/authseq/signup')
      .send({
        firstname: 'Gordon',
        lastname: 'Hayward',
        email: 'gordon@haha.com',
        password: 'haha',
      }).end((err, result) => {
        result.should.have.status(200);

        done();
      });
  });

  it('POST - /authseq/signin - correct credential should let the user sign in', (done) => {
    chai.request(server)
      .post('/authseq/signin')
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
}); // end of describe('Auth Sequelize')
