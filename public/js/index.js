var socket = io();
socket.on('connect', function() {
	console.log('Connected');

});
socket.on('disconnect', function() {
	console.log('Disconnected')
});

socket.on('newMessage', function(message) {
	var formatedTime = moment(message.createdAt).format('HH:mm');
	var li = $('<li></li>');
	li.text(`${message.from} ${formatedTime}: ${message.text}`);

	$('#messages').append(li);
})

socket.on('newLocMessage', function(message) {
	var formatedTime = moment(message.createdAt).format('HH:mm');
	var li = $('<li></li>');
	var a = $('<a target="_blank">My Location</a>');
	console.log('New message');
	li.text(`${message.from} ${formatedTime}: `);
	a.attr('href', `${message.url}`);
	li.append(a);
	$('#messages').append(li);
})


$('#message-form').on('submit', function(e){

	var messageTextbox = $('[name=message]');
	e.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: messageTextbox.val()
	}, function() {
		messageTextbox.val('')
	})
	
})

var geo = navigator.geolocation
var locButton = $('#send-loc');
locButton.on('click', function(){
	if(!geo){
		return alert('geolocation is not supported');
	}

	locButton.attr('disabled', 'disabled').text('Sending location...')

	geo.getCurrentPosition(function(position){
		locButton.removeAttr('disabled').text('Send location!');
		socket.emit('createLocMessage', {
			lat: position.coords.latitude,
			long: position.coords.longitude
		})
	}, function() {
		locButton.removeAttr('disabled').text('Send location!');
		alert('Unable to fetch location');

	})
})