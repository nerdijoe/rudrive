const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const aboutSchema = new Schema({
  overview: { type: String },
  work: { type: String },
  education: { type: String },
  contact_info: { type: String },
  life_events: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false, default: Date.now },
});

var About = mongoose.model('About', aboutSchema);

module.exports = About;
