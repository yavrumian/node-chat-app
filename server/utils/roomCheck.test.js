const {checkRoom} = require('./roomCheck')
const expect = require('expect')
var rooms = [{
    name: 'gag',
    count: 47
}, {
    name: 'harut',
    heigth: 478
}, {
    name: 'lox',
    bog: 585
}]
describe('checkRoom', () => {
    it('should return true if room name already exists', () =>{
        var res = checkRoom(rooms, rooms[1].name);
        expect(res).toBe('1')
    });
    it('Should return undefined if room name doesn\'t exist', () =>{
        var res = checkRoom(rooms, 'qqq');
        expect(res).toBeFalsy()
    })
})
