var expect = require('expect');

var {generateMessage} = require('./message')

describe('generateMessage', () => {
	it('Should generate correct message object', () => {
		var from = "Vahe";
		var text = 'Teeext';
		var res = generateMessage(from, text);
		expect(res).toMatchObject({
			from,
			text,
		});
		expect(typeof res.createdAt).toBe('number');
	})
});