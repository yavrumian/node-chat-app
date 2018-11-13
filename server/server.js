const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8080;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.on('join', (params, callback) => {
		if(!isRealString(params.name) || !isRealString(params.room)){
			callback('Name and room name are required')
		}
		socket.join(params.room)
		socket.emit('newMessage', generateMessage('Admin', 'Welcome User'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
		callback('')
	})

	socket.on('createMessage', (message, callback) => {
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocMessage', (coords) => {
		io.emit('newLocMessage', generateLocMessage('Admin', coords.lat, coords.long))
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	});

});

server.listen(port, () => {
	console.log('App is running on port ' + port )
})
