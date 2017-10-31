const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activitySchema = new Schema({
  action: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false, default: Date.now },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
