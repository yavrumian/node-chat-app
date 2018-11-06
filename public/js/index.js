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
	var li = $('<li></li>');
	li.text(`${message.from}: ${message.text}`);

	$('#messages').append(li);
})


$('#message-form').on('submit', function(e){
	e.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function() {

	})
	$('[name=message]').val('')
})