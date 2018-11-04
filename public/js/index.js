var socket = io();
socket.on('connect', function() {
	console.log('Connected');

});
socket.on('disconnect', function() {
	console.log('Disconnected')
});

socket.on('newMessage', function(message) {
	console.log('New message');
	console.log(message);
})