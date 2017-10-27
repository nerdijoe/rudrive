const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  mysql_id: { type: Number, required: true },
  // files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
  // folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
