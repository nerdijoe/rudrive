var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

const should = chai.should();

var server = require('../app');
var db = require('../models');
const User = require('../models/mongoose_user');
const File = require('../models/mongoose_file');
const Folder = require('../models/mongoose_folder');

let passwordHash = require('password-hash');

describe('Files and Folders', () => {

  let token = '';
  let user_id = '';

  let name = 'practice_1509772814577.sql';
  let path = './public/uploads/rudy@haha.com';
  let full_path = './public/uploads/rudy@haha.com/practice_1509772814577.sql';
  let type = 'application/octet-stream';
  let size = "178";
  let is_starred = false;
  let is_deleted = false;

  let newDirName = 'foo';
  let currentPath = "./public/uploads/rudy@haha.com";
  let newDirPath = "./public/uploads/rudy@haha.com/foo";
  let folder_is_deleted = false;
  let folder_is_starred = false;



  // beforeEach((done) => {
  //   var newUser = {
  //     firstname: 'Rudy',
  //     lastname: 'W',
  //     email: 'rudy@haha.com',
  //     password: passwordHash.generate('haha'),
  //   };

  //   db.User.create(newUser)
  //     .then((user) => {
  //       newUser_id = user.id;
  //       user_id = user.id

  //       chai.request(server)
  //         .post('/authseq/signin')
  //         .send({
  //           email: 'rudy@haha.com',
  //           password: 'haha',
  //         })
  //         .end((err, result) => {
  //           console.log('****** result.body=', result.body);
  //           token = result.body.token;
  //           done();
  //         });


  //     });
  // }); // end of beforeEach

  // afterEach((done) => {
  //   db.User.destroy({where: {}})
  //     .then(() => {
  //       done();
  //     });
  // });

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


          // size" : "178",
          // "user" : ObjectId("59fa5fcf7ad966671c8dde4a"),
          // "updatedAt" : ISODate("2017-11-04T05:20:14.593Z"),
          // "createdAt" : ISODate("2017-11-04T05:20:14.593Z"),
          // "users" : [],
          // "is_deleted" : false,
          // "is_starred" : false,

          // upload a file
          const newFile = File({
            name,
            path,
            full_path,
            type,
            size,
            is_starred,
            user: user._id,
            is_deleted,
          });
    
          newFile.save((err, file) => {
            console.log('>>>> inserted to mongoDB, file=', file);
    
            // res.json(file);

            // "name" : "dor",
            // "path" : "./public/uploads/bro23@haha.com",
            // "full_path" : "./public/uploads/bro23@haha.com/dor",
            // "user" : ObjectId("59fa5fcf7ad966671c8dde4a"),
            // "updatedAt" : ISODate("2017-11-04T07:51:08.257Z"),
            // "createdAt" : ISODate("2017-11-04T07:51:04.739Z"),
            // "users" : [],
            // "is_deleted" : true,
            // "is_starred" : false,

            const newFolder = Folder({
              name: newDirName,
              path: currentPath,
              full_path: newDirPath,
              is_starred: folder_is_deleted,
              is_deleted: folder_is_starred,
              user: user._id,
            });

            newFolder.save((err, folder) => {
              console.log('>>>> mongo inserted a new folder', folder);
              // res.json(folder);
              done();
            });
          });
        });
    });

    // upload a new file
  }); // end of beforeEach

  afterEach((done) => {
    User.findByIdAndRemove( user_id, (err, user) => {
      done();
    });
  });


  // user has signed in and use the token to access server API
  it('GET - /files/root - should have one file in the root folder', (done) => {
    chai.request(server)
      .get('/files/root')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get files", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('array');
        result.body.length.should.equal(1);

        done();
      });
  });

  it('GET - /files/root - file information should match with the the file being uploaded in the root folder', (done) => {
    
    chai.request(server)
      .get('/files/root')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get files", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('array');

        result.body[0].name.should.equal(name);
        result.body[0].path.should.equal(path);
        result.body[0].full_path.should.equal(full_path);
        result.body[0].type.should.equal(type);
        result.body[0].is_starred.should.equal(is_starred);
        result.body[0].is_deleted.should.equal(is_deleted);

        done();
      });
  });

  it('GET - /folders/root - should return one folder in the root folder', (done) => {
    chai.request(server)
      .get('/folders/root')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get folders", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('array');
        result.body.length.should.equal(1);

        done();
      });
  });

  it('GET - /folders/root - folder information should match with the the folder that was created in the root folder', (done) => {
    chai.request(server)
      .get('/folders/root')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get folders", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('array');

        result.body[0].name.should.equal(newDirName);
        result.body[0].path.should.equal(currentPath);
        result.body[0].full_path.should.equal(newDirPath);
        result.body[0].is_starred.should.equal(folder_is_starred);
        result.body[0].is_deleted.should.equal(folder_is_deleted);

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
      .get('/folders/59fed1e6da4a701fd77165f5')
      .set('token', token)
      .end((err, result) => {
        console.log("*** get folders by id", result.body);
        result.should.have.status(200);
        result.should.be.an('object');
        result.body.should.be.an('object');

        result.body.should.have.property('msg');

        result.body.msg.should.equal('folder id is invalid');

        done();
      });
  });

})
