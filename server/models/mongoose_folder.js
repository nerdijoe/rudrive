const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const folderSchema = new Schema({
  name: { type: String },
  path: { type: String },
  full_path: { type: String },
  is_starred: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

var Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
