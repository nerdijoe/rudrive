const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const interestSchema = new Schema({
  music: { type: String },
  shows: { type: String },
  sports: { type: String },
  fav_teams: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false, default: Date.now },
});

const Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;
