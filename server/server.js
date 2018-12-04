const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');

const {checkRoom} = require('./utils/roomCheck')
const {Users} = require('./utils/users');
const {generateMessage, generateLocMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8080;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var params;
var activeRooms = []
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath));

io.on('connection', (socket) => {
	socket.on('data', (data) => {
		params = data
	})
	socket.on('join', (callback) => {
		if(!params) return callback('username and room name are required')
		var username = users.getUserList(params.room).filter((user) => user === params.name);
		if(!isRealString(params.name) || !isRealString(params.room)){
			return callback('Name and room name are required');
		}
		if(username.length > 0){
			return callback('that username is already in use, please take another one');
		}
		socket.join(params.room);
		var roomIndex = checkRoom(activeRooms, params.room);
		if(!roomIndex){
			activeRooms.push({
				name: params.room,
				count: 1,
				isSecret: params.isSecret
			})
		}else{
			activeRooms[roomIndex].count += 1;
		}
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		socket.emit('setRoomName', {
			room: params.room,
			name: params.name
		})
		socket.emit('newMessage', generateMessage('Admin', 'Welcome User'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
		callback('')
	})

	socket.on('createMessage', (message, callback) => {
		var user = users.getUser(socket.id);
		if(user && isRealString(message.text)){
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		callback();
	});

	socket.on('createLocMessage', (coords) => {
		var user = users.getUser(socket.id);
		if(user){
			io.to(user.room).emit('newLocMessage', generateLocMessage(user.name, coords.lat, coords.long))
		}
	})

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);
		if(user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
			var roomIndex = checkRoom(activeRooms, user.room);
			if(activeRooms[roomIndex]){
				if(activeRooms[roomIndex].count <=1){
					activeRooms.splice(roomIndex, 1)
				}else {
					activeRooms[roomIndex].count -= 1;
				}
			}
		}
	});
});

server.listen(port, () => {
	console.log('App is running on port ' + port )
})
