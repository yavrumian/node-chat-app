const expect  = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('Should reject non-string values', () => {
        expect(isRealString({name: 'Vahe'})).toBeFalsy();
    })
    it('Should reject string with only spaces', () => {
        expect(isRealString('      ')).toBeFalsy();
    })
    it('Should allow atring with non-space characters', () => {
        expect(isRealString('non-space')).toBeTruthy();
    })
})
