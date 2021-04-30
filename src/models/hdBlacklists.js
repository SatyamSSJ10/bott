const mongoose = require('mongoose');

module.exports = mongoose.model(
	'hdBlacklists',
	new mongoose.Schema({
		channel_id: String,
		blacklistedBy: String,
	}),
	'hdBlacklists',
);
