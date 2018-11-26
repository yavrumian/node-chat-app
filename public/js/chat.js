var socket = io();

var currentUser;
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

$('.chat__messages').css('padding-top', $('.chat__head').height())

socket.on('connect', function() {
	socket.emit('join',function(err) {
		if(err) {
			alert(err)
			window.location.href = '/'
		}
	});
});
socket.on('disconnect', function() {

});

socket.on('updateUserList', function (users) {
	var ul = $('<ul></ul>');
	users.forEach(function (user) {

		ul.append($('<li></li>').text(user));
	});

	$('#users').html(ul);
})

socket.on('setRoomName', function (user) {
	currentUser = user.name;
	$('#chat-head').text(user.room);
});

socket.on('newMessage', function(message) {
	var formatedTime = moment(message.createdAt).format('HH:mm');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		time: formatedTime
	});
	if(message.from === currentUser){
		html = $.parseHTML(html);
		var header = $($(html[1]).children()).children()[0];
		$(header).css('color', '#0061c5')
	}else if(message.from === 'Admin'){
		console.log('asdm mes');
		html = $.parseHTML(html);
		var text = $(html[1]).children()[1]
		$(text).css({
			'font-style': 'italic',
			'text-decoration': 'underline'
		})
		console.log(text);
	}
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
var toggled;
var toggle = $('#toggle-sidebar');
if($(window).width() <= 720){
	toggled = false;
	toggle.text('❱');
}else{
	toggled = true;
	toggle.text('❰');
}

toggle.on('click', function () {
	if($('#message-input').is(':focus')) {

	}else{
		if(toggled){
			$('#sidebar').hide()
			toggle.text('❱');
			toggled = false
		}else{
			$('#sidebar').show()
			toggle.text('❰');
			toggled = true;
		}
	}
})
$('#message-input').on('focus', function () {
	if($(window).width() <= 720){
		$('#sidebar').hide();
		toggle.text('❱');
		toggled = false
	}

})
$('#back-button').click(function(event) {
	event.preventDefault();
	window.location.href = '/'
})
