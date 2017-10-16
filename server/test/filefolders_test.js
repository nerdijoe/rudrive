var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

const should = chai.should();

var server = require('../app');
var db = require('../models');
let passwordHash = require('password-hash');

describe('Files and Folders', () => {

  let token = '';
  let user_id = '';

  beforeEach((done) => {
    var newUser = {
      firstname: 'Rudy',
      lastname: 'W',
      email: 'rudy@haha.com',
      password: passwordHash.generate('haha'),
    };

    db.User.create(newUser)
      .then((user) => {
        newUser_id = user.id;
        user_id = user.id

        chai.request(server)
          .post('/authseq/signin')
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
    db.User.destroy({where: {}})
      .then(() => {
        done();
      });
  });



  // user has signed in and use the token to access server API
  it('GET - /files/root - should return all files in the root folder', (done) => {
    chai.request(server)
      .get('/files/root')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get files", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('array');
        result.body.length.should.equal(0);

        done();
      });
  });

  it('GET - /folders/root - should return all folders in the root folder', (done) => {
    chai.request(server)
      .get('/folders/root')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get folders", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('array');
        result.body.length.should.equal(0);

        done();
      });
  });

  it('GET - /files/share - should return all files that are given share access by other user', (done) => {
    chai.request(server)
      .get('/files/share')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get files share", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('array');
        result.body.length.should.equal(0);

        done();
      });
  });

  it('GET - /folders/share - should return all folders that are given share access by other user', (done) => {
    chai.request(server)
      .get('/folders/share')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get folders share", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('array');
        result.body.length.should.equal(0);

        done();
      });
  });

  // it('POST - /uploads/createfolder - create new folder', (done) => {
  //   chai.request(server)
  //     .post('/uploads/createfolder')
  //     .set('token', token)
  //     .send({
  //       name: 'newfolder04',
  //       currentPath: './public/uploads/rudy@haha.com',
  //     })
  //     .end((err, result) => {
  //       console.log("***** create folder", result.body)
  //       result.should.have.status(200);
  //       result.should.be.an('object');
  //       result.body.should.be.an('object');

  //       // result.body.should.have.property('id');
  //       result.body.should.have.property('name');
  //       result.body.should.have.property('path');
  //       result.body.should.have.property('full_path');
  //       result.body.should.have.property('is_starred');
  //       result.body.should.have.property('is_deleted');
  //       result.body.should.have.property('updatedAt');
  //       result.body.email.should.equal('createdAt');
  //       done();
  //     });
  // });

  it('GET - /folders/invalidId - should not return folder contents, it returns json message', (done) => {
    chai.request(server)
      .get('/folders/99')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get folders by id", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('object');

        result.body.should.have.property('msg');

        result.body.msg.should.equal('folder id is invalid.');

        done();
      });
  });

})
