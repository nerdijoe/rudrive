const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  name: { type: String },
  path: { type: String },
  full_path: { type: String },
  aws_s3_path: { type: String, default: '' },
  type: { type: String },
  size: { type: String },
  is_starred: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false, default: Date.now },
});

var File = mongoose.model('File', fileSchema);

module.exports = File;
