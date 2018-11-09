var expect = require('expect');

var {generateMessage, generateLocMessage} = require('./message')

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

describe('generateLocMessage', ()=>{
	it('Should generate current location message', () =>{
		var from = 'Vahe';
		var res = generateLocMessage(from, 1, 2);
		expect(res).toMatchObject({
			from,
			url: 'https://www.google.com/maps?q=1, 2'
		});
		expect(typeof res.createdAt).toBe('number');
	})
})