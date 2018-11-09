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

socket.on('newLocMessage', function(message) {
		var li = $('<li></li>');
		var a = $('<a target="_blank">My Location</a>');
		console.log('New message');
		li.text(`${message.from}: `);
		a.attr('href', `${message.url}`);
		li.append(a);
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

var geo = navigator.geolocation
var locButton = $('#send-loc');
locButton.on('click', function(){
	if(!geo){
		return alert('geolocation is not supported');
	}

	geo.getCurrentPosition(function(position){
		socket.emit('createLocMessage', {
			lat: position.coords.latitude,
			long: position.coords.longitude
		})
	}, function() {
		alert('Unable to fetch location');
	})
})