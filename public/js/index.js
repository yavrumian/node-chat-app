var socket = io.connect()

$('button').click(function (event) {
        event.preventDefault();
        socket.emit('data', {
            room: $('input[name=room]').val(),
            name: $('input[name=name]').val()
        })
        window.location.href = '/chat.html'
})
