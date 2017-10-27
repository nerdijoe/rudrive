const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const interestSchema = new Schema({
  music: { type: String },
  shows: { type: String },
  sports: { type: String },
  fav_teams: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;
