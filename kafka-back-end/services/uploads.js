const mongoose = require('mongoose');
const fs = require('fs');
const Folder = require('../models/mongoose_folder');
const File = require('../models/mongoose_file');

module.exports = {
  uploadFile: (msg, cb) => {

    const req = msg;

    console.log('uploadFile msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    const currentPath = req.currentPath;

    Folder.findOne({ _id: currentPath }, (err, folder) => {
      console.log('After Folder.findOne, folder=', folder);
      const file = req.file;
      const userEmail = req.decoded.email;

      console.log('file', file);
      
      // var dir = `./public/uploads/${userEmail}`;
      let dir = `./public/uploads/${userEmail}`;
      if (folder) {
        dir = folder.full_path;
      }
      
      // create dir if it doesn't exist
      if (!fs.existsSync(dir)) {
        console.log(`~~~~~~ dir'${dir}' does not exist, so create one`);
        fs.mkdirSync(dir);
      }
  
      const default_path = file.path;
      const target_path = dir + '/' + file.filename;
  
      // fs.rename(default_path, target_path, (err) => {
      fs.writeFile(target_path, req.binaryFile, 'binary', (err) => {
        if (err) throw err;
  
        console.log(`>>> ${file.filename} has been moved to ${target_path}`);
  
        // add to db
        /*
        uploadFile req.file { fieldname: 'doc',
          originalname: 'Police.csv',
          encoding: '7bit',
          mimetype: 'text/csv',
          destination: './public/uploads/',
          filename: 'Police_1507247984057.csv',
          path: 'public/uploads/Police_1507247984057.csv',
          size: 5740 }
        */
  
        const user_id = mongoose.Types.ObjectId(req.decoded._id);
        // todo.tasks.push(task_id);
  
        const newFile = File({
          name: req.file.filename,
          path: dir,
          full_path: target_path,
          type: req.file.mimetype,
          size: req.file.size,
          is_starred: false,
          user: user_id,
          is_deleted: false,
        });
  
        newFile.save((err, file) => {
          console.log('>>>> inserted to mongoDB, file=', file);
          // res.json(file);
          cb(false, file);
        });
      }); // end of fs.rename
    });
  },
  createFolder: (msg, cb) => {
    const req = msg;

    console.log('uploadFile msg=', msg);
    console.log('---> req.decoded._id=', mongoose.Types.ObjectId(req.decoded._id));

    const userEmail = req.decoded.email;

    const newDirName = req.body.name;
    const currentPath = req.body.currentPath;

    // var newDirPath = `./public/uploads/${userEmail}/${newDirName}`;
    const newDirPath = `${currentPath}/${newDirName}`;
    // create dir if it doesn't exist
    if (!fs.existsSync(newDirPath)) {
      fs.mkdirSync(newDirPath);
      console.log(`folder '${newDirName}' is created`);

      // insert to DB
      const newFolder = Folder({
        name: newDirName,
        path: currentPath,
        full_path: newDirPath,
        is_starred: false,
        is_deleted: false,
        user: mongoose.Types.ObjectId(req.decoded._id),
      });
  
      newFolder.save((err, folder) => {
        console.log('>>>> mongo inserted a new folder', folder);
        // res.json(folder);
        cb(false, folder);
      });
  
      // db.Folder.create(new_folder)
      //   .then( (folder) => {
      //     console.log('>>>> DB inserted a new folder', folder);
      //     res.json(folder);
  
      //     // need to return the newly created folder with the Users
      //     // db.Folder.findAll({
      //     //   where: { id: folder_id },
      //     //   include: [{ model: db.User }],
      //     // }).then((shareInfo) => {
      //     //   console.log('shareInfo', shareInfo);
      //     //   res.json(shareInfo);
      //     // });
  
      //   })
    } else {
      const msg = {
        message: `folder '${newDirName}' is already existed`,
      };
      console.log(msg);
      // res.json(msg);
      cb(false, msg);
    }

  }
};
