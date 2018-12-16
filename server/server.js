require('./config/config')

const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const redis = require('redis');
const fs = require('fs');

const {mongoose} = require('./db/mongoose');
const {Message} = require('./models/message')
const {checkRoom} = require('./utils/roomCheck')
const {Users} = require('./utils/users');
const {generateMessage, generateLocMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT;
var users = new Users();
var params;
var activeRooms = [];
var queue = [];
var peer;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath));


io.on('connection', (socket) => {
	socket.on('data', (data) => {
		params = data;
	})
	socket.on('join', (callback) => {
		if(!params) return callback('Fields marked with * are required');
		if(params.isRandom){
			if(!params) return callback('username is required');
			if(!isRealString(params.name)){
				return callback('Name is required');
			}
			if(queue.length === 0){
				queue.push({socket, name: params.name});
				callback('', true, false)
			}else{
				peer = queue.pop();
				var room = `${peer.name} & ${params.name}`;
				users.removeUser(socket.id);
				users.removeUser(peer.socket.id);
				users.addUser(socket.id, params.name, room);
				users.addUser(peer.socket.id, peer.name, room);
				socket.join(room);
				peer.socket.join(room);
				peer.socket.emit('match');
				socket.emit('setRoomName', {
					room,
					name: params.name
				})
				peer.socket.emit('setRoomName', {
					room,
					name: peer.name
				})
				callback('', true, true)
			}

		}else{
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
		}
	})

	socket.on('load', async (data, callback) => {
		var user = users.getUser(socket.id);
		try{
			const msgs = await Message.find({room: user.room}).sort({createdAt: -1}).limit(data.num).skip(data.count);
			msgs.forEach((msg) => {
				io.to(user.room).emit('newMessage', {
					from: msg._creator,
					text: msg.text,
					createdAt: msg.createdAt,
					isLoad: true
				});
			})
			if(msgs.length < data.num){
				callback('OUT_OF_MESSAGES')
			}
			callback();
		}catch(e){
			callback('UNKNOWN_ERR')
		}
	})

	socket.on('createMessage', (message, callback) => {
		var user = users.getUser(socket.id);
		var msg = generateMessage(user.name, message.text)
		if(user && isRealString(message.text)){
			io.to(user.room).emit('newMessage', msg);
		}
		if(!message.isRandom){
			new Message({
				text: message.text,
				_creator: user.name,
				createdAt: msg.createdAt,
				room: user.room
			}).save();
		}
		callback();
	});

	socket.on('createLocMessage', (coords) => {
		var user = users.getUser(socket.id);
		if(user){
			io.to(user.room).emit('newLocMessage', generateLocMessage(user.name, coords.lat, coords.long))
		}
	})

	socket.on('refreshRoomList', () => {
		socket.emit('updateRoomList', activeRooms.filter((room) => room.isSecret == false))
	})

	socket.on('disconnect', () => {
		if(queue[0] && (queue[0].socket.id === socket.id)){
			queue.pop();
		}
		var user = users.removeUser(socket.id);
		if(user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`), true);
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

http.listen(port, () => {
	console.log('App is running on port ' + port )
})
