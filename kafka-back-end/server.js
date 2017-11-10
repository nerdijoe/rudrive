const mongoose = require('mongoose');
require('dotenv').config();


const connection =  new require('./kafka/Connection');
const action = require('./helpers/actionConstants');
const auth = require('./services/auth');
const upload = require('./services/uploads');
const files = require('./services/files');
const users = require('./services/users');
const folders = require('./services/folders');

const topic_name = 'request_topic';
const consumer = connection.getConsumer(topic_name);
const producer = connection.getProducer();

// mongoose setup ####
const dbConfig = {
  development: 'mongodb://127.0.0.1/273_lab1_dropbox_dev',
  test: 'mongodb://127.0.0.1/273_lab1_dropbox_test'
};

const appEnv = 'development'; //app.settings.env;
const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
};


mongoose.Promise = global.Promise;
mongoose.connect(dbConfig[appEnv], options, (err, res) => {
  console.log(`Connected to DB: ${dbConfig[appEnv]}`);
});
// mongoose setup end ####


// const MongoPool = require('./helpers/customConnectionPooling');
// const customPool = new MongoPool(10);
// customPool.initPool();


console.log('server is running');
consumer.on('message', (message) => {
  console.log('--- consumer.on -> message received');
  console.log(JSON.stringify(message.value));
  console.log('----------------------------------\n')
  const data = JSON.parse(message.value);
  console.log('#### action =', data.data.action);
  switch (data.data.action) {
    case action.USER_SIGN_IN: {
      auth.signIn(data.data, (err, res) => {
        console.log('after USER_SIGN_IN, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      
      break;
    }

    case action.USER_SIGN_IN_TOKEN: {
      auth.signInToken(data.data, (err, res) => {
        console.log('after USER_SIGN_IN_TOKEN, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });

      break;
    }

    case action.USER_SIGN_UP: {
      auth.signUp(data.data, (err, res) => {
        console.log('after USER_SIGN_UP, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FETCH_USER_ABOUT: {
      users.fetchAbout(data.data, (err, res) => {
        console.log('after FETCH_USER_ABOUT, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.UPDATE_USER_ABOUT: {
      users.updateAbout(data.data, (err, res) => {
        console.log('after UPDATE_USER_ABOUT, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FETCH_USER_INTEREST: {
      users.fetchInterest(data.data, (err, res) => {
        console.log('after FETCH_USER_INTEREST, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.UPDATE_USER_INTEREST: {
      users.updateInterest(data.data, (err, res) => {
        console.log('after UPDATE_USER_INTEREST, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.ADD_ACTIVITY: {
      users.insertActivity(data.data, (err, res) => {
        console.log('after ADD_ACTIVITY, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FETCH_ACTIVITIES: {
      users.fetchActivities(data.data, (err, res) => {
        console.log('after FETCH_ACTIVITIES, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FETCH_FILES: {
      console.log("here");
      files.fetchFiles(data.data, (err, res) => {
        console.log('after FETCH_FILES, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }
    case action.ADD_NEW_FILE: {
      upload.uploadFile(data.data, (err, res) => {
        console.log('after ADD_NEW_FILE, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.STAR_FILE: {
      files.starFile(data.data, (err, res) => {
        console.log('after STAR_FILE, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.DELETE_FILE: {
      files.deleteFile(data.data, (err, res) => {
        console.log('after DELETE_FILE, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FILE_SHARING_ADD: {
      files.addFileSharing(data.data, (err, res) => {
        console.log('after FILE_SHARING_ADD, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FILE_SHARING_REMOVE: {
      files.removeFileSharing(data.data, (err, res) => {
        console.log('after FILE_SHARING_REMOVE, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FETCH_SHARE_FILES: {
      files.fetchFileSharing(data.data, (err, res) => {
        console.log('after FETCH_SHARE_FILES, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.ADD_NEW_FOLDER: {
      upload.createFolder(data.data, (err, res) => {
        console.log('after ADD_NEW_FOLDER, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FETCH_FOLDERS: {
      folders.fetchRootFoldersWithShare(data.data, (err, res) => {
        console.log('after FETCH_FOLDERS, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.STAR_FOLDER: {
      folders.starFolder(data.data, (err, res) => {
        console.log('after STAR_FOLDER, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.DELETE_FOLDER: {
      folders.deleteFolder(data.data, (err, res) => {
        console.log('after DELETE_FOLDER, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FETCH_CONTENTS_BY_FOLDER_ID: {
      folders.fetchById(data.data, (err, res) => {
        console.log('after FETCH_CONTENTS_BY_FOLDER_ID, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FOLDER_SHARING_ADD: {
      folders.addFolderSharing(data.data, (err, res) => {
        console.log('after FOLDER_SHARING_ADD, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FOLDER_SHARING_REMOVE: {
      folders.removeFolderSharing(data.data, (err, res) => {
        console.log('after FOLDER_SHARING_REMOVE, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }

    case action.FETCH_SHARE_FOLDERS: {
      folders.fetchFolderSharing(data.data, (err, res) => {
        console.log('after FETCH_SHARE_FOLDERS, res=', res);
        const payloads = [
          {
            topic: data.replyTo,
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, (err, data) => {
          console.log('producer.send');
          console.log(data);
        });
        return;
      });
      break;    
    }


    default: {
      console.log('invalid Action');
    }
  }

});
