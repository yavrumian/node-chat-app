class Users {
    constructor() {
        this.users = []
    }
    addUser(id, name, room){
        var user = {
            id,
            name,
            room
        }
        this.users.push(user);
        return user;
    }
    removeUser (id) {
        var removedUser = this.getUser(id);
        if(removedUser) this.users = this.users.filter((user) => user.id !== id);

        return removedUser;
    }
    getUser (id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArr = users.map((user) => user.name)

        return namesArr
    }
}

module.exports = {Users}
