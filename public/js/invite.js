var socket = io.connect();
const room = atob(decodeURIComponent($.deparam().room));
const name = atob(decodeURIComponent($.deparam().name));
$('#room-name').text(room);
$('#user-name').text(name);
$('button').click(function (event) {
        event.preventDefault();
        socket.emit('data', {
            room,
            name: $('input[name=name]').val()
        })
        window.location.href = '/chat.html'

})
