var mongoose = require('mongoose');

var Message = mongoose.model('Message', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	createdAt: {
		type: Number,
        required: true
	},
    room:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
	_creator: {
		type: String,
		required: true
	}
});

module.exports = {Message}
