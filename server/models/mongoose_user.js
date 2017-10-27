const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  // mysql_id: { type: Number },
  // files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
  // folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
