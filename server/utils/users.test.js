const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    var users
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'Gag',
            room: 'Room'
        }, {
            id: 2,
            name: 'Has',
            room: 'Room2'
        }, {
            id: 3,
            name: 'Vaz',
            room: 'Room'
        }]
    })
    it('Should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Vahe',
            room: 'fun'
        }
        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    describe('removeUser', () => {
        it('Should remove a user', () => {
            var user = users.removeUser(2);
            expect(user).toEqual({
                id: 2,
                name: 'Has',
                room: 'Room2'
            });
            expect(users.users.length).toBe(2);
        });

        it('Should not remove a user', () => {
            var userList = users.users;
            var user = users.removeUser(8);
            expect(user).toBeFalsy();
            expect(users.users.length).toBe(3)
        })
    })

    describe('getUser', () => {
        it('Should find user', () => {
            var user = users.getUser(2);

            expect(user).toEqual({
                id: 2,
                name: 'Has',
                room: 'Room2'
            })
        });
        it('Should not find a user', () => {
            var user = users.getUser(5);

            expect(user).toBeFalsy();
        })
    })

    describe('getUserList', () => {
        it('Should return names for Room', () => {
            var userList = users.getUserList('Room');

            expect(userList).toEqual(['Gag', 'Vaz'])
        });
        it('Should return names for Room2', () => {
            var userList = users.getUserList('Room2');

            expect(userList).toEqual(['Has'])
        })
    })
})
