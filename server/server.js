const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8080;
var app = express();
var server = http.createServer(app);
io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', {
		from: "admin",
		text: "Welcome govnyuk",
		createdAt: new Date().getTime()
	});
	socket.broadcast.emit('newMessage', {
		from: "Admin",
		text: "Govnyuk joined",
		createdAt: new Date().getTime()
	})
	socket.on('createMessage', (message) => {

		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		})

		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// })
	});


	socket.on('disconnect', () => {
		console.log('user disconnected')
	});

});

server.listen(port, () => {
	console.log('App is running on port ' + port )
})



