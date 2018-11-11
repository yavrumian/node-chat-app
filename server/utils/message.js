var moment = require('moment');

var generateMessage = (from, text) => {
	return {
		from, 
		text,
		createdAt: moment().valueOf()
	}
};

var generateLocMessage = (from, lat, long) => {
	return {
		from,
		url: `https://www.google.com/maps?q=${lat}, ${long}`,
		createdAt: moment().valueOf()
	}
}

module.exports = {
	generateMessage,
	generateLocMessage
}