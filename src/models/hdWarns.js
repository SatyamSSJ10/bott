const mongoose = require('mongoose');

module.exports = mongoose.model(
	'hdWarns',
	new mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		warnedMember: String,
		warnedStaff: String,
		reason: String,
		when: Date,
	}),
	'hdWarns',
);
