const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8080;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome User'));
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'One more user joined'))
	socket.on('createMessage', (message, callback) => {
		console.log(message);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('This is from server');
	});


	socket.on('disconnect', () => {
		console.log('user disconnected')
	});

});

server.listen(port, () => {
	console.log('App is running on port ' + port )
})



