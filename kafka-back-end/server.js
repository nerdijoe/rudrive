const mongoose = require('mongoose');


const connection =  new require('./kafka/Connection');
const login = require('./services/login');

const topic_name = 'login_topic';
const consumer = connection.getConsumer(topic_name);
const producer = connection.getProducer();

// mongoose setup ####
const dbConfig = {
  development: 'mongodb://127.0.0.1/273_lab1_dropbox_dev',
  test: 'mongodb://127.0.0.1/273_lab1_dropbox_test'
};

const appEnv = 'development'; //app.settings.env;
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig[appEnv], { useMongoClient: true }, (err, res) => {
  console.log(`Connected to DB: ${dbConfig[appEnv]}`);
});
// mongoose setup end ####


console.log('server is running');
consumer.on('message', (message) => {
  console.log('--- consumer.on -> message received');
  console.log(JSON.stringify(message.value));
  console.log('----------------------------------\n')
  const data = JSON.parse(message.value);
  login.handle_request(data.data, (err, res) => {
    console.log('after handle, res=', res);
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
});
