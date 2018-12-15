var socket = io();
var backPath = '';
var currentUser;
var count = 0;
var random;
function scrollToBottom() {
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child');
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
		messages.scrollTop(scrollHeight);
	}
}
$(document).ready(function(){
	$('#myPopup').hide();
})
$('.chat__messages').css('padding-top', $('.chat__head').height())

socket.on('connect', function() {
	socket.emit('join',function(err, isRandom, isMatch) {
		if(err) {

			Cookies.remove('room', {path: '/'});
			window.location.href = '/'
		}
		if(isRandom){
			backPath = 'random.html'
		}
		if(!isMatch && isRandom){
			$("body").children().attr("style", "display: none !important");
			$('#loader').attr("style", "display: flex !important");

		}
		random = isRandom;
	});
	socket.emit('load', {num: 25, count: count}, function(err){
		if(err){

			Cookies.remove('room', {path: '/'});
			window.location.href = '/';
			console.log(err);
		}
		count += 25
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

socket.on('match', function(){
	$("body").children().removeAttr("style", "display: none !important");
	$('#loader').removeAttr("style", "display: flex !important");
})

socket.on('setRoomName', function (user) {
	var encodedRoom = encodeURIComponent(Base64.encode(user.room));
	var encodedName = encodeURIComponent(Base64.encode(user.name))
	currentUser = user.name;
	$('#chat-head').text(user.room);
	$('#shareable-link').attr('value', window.location.hostname + '/invite.html?room=' + encodedRoom +  '&name=' + encodedName)
});

socket.on('newMessage', function(message, logout) {
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
		if(backPath && logout){
			window.location.href = '/random.html'
		}
		html = $.parseHTML(html);
		var text = $(html[1]).children()[1]
		$(text).css({
			'font-style': 'italic',
			'text-decoration': 'underline'
		})
	}
	if(message.isLoad) $('#load-more').parent().after(html)
	else $('#messages').append(html)
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
		isRandom: random,
		text: messageTextbox.val()
	}, function() {
		messageTextbox.val('')
	})

})

var geo = navigator.geolocation;
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
	Cookies.remove('room', {path: '/'});
	window.location.href = '/' + backPath
})
$('.fa-share-square').click(function () {
	$('#myPopup').toggle()
})
var copy = new ClipboardJS('.fa-copy');
$('.fa-copy').tooltip({
	content: 'Copy the text',
	classes:{
		'ui-tooltip': 'custom-black'
	}
});
copy.on('success', function(e){
	console.log('success');
	$('.fa-copy').tooltip({
		content: 'Copied!',
		classes:{
			'ui-tooltip': 'custom-black'
		}
	});
	setTimeout(function(){
		$('.fa-copy').tooltip({
			content: 'Copy the text',
			classes:{
				'ui-tooltip': 'custom-black'
			}
		});
		$( ".fa-copy" ).tooltip( "close" );
	}, 2000)
});
$(document).mouseup(function(e) {
    var container = $('.button__share');

    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        $('#myPopup').hide();
		$( ".fa-copy" ).tooltip( "close" );
    }
});


$('#load-more').click(function(){
	socket.emit('load', {num: 10, count: count}, function(err){
		if(err){
			Cookies.remove('room', {path: '/'});
			window.location.href = '/'
		}
		count += 10
	});
})
