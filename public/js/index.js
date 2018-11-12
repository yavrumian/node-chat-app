var socket = io();

function scrollToBottom() {
	//Selectors
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child');
	//Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function() {
	console.log('Connected');

});
socket.on('disconnect', function() {
	console.log('Disconnected')
});

socket.on('newMessage', function(message) {
	var formatedTime = moment(message.createdAt).format('HH:mm');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		time: formatedTime
	});

	$('#messages').append(html)
	scrollToBottom();
})

socket.on('newLocMessage', function(message) {
	var formatedTime = moment(message.createdAt).format('HH:mm');

	var template = $('#loc-message-template').html();
	var html = Mustache.render(template, {
		time: formatedTime,
		from: message.from,
		url: message.url
	})
	$('#messages').append(html);
	scrollToBottom();
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
