var socket = io.connect();
function isRealString (str){
    return typeof str === 'string' && str.trim().length > 0;
}

$('button').click(function (event) {
        event.preventDefault();
        if(isRealString($('input[name=room]').val()) && isRealString($('input[name=name]').val())){
            socket.emit('data', {
                room: $('input[name=room]').val(),
                name: $('input[name=name]').val()
            })
            window.location.href = '/chat.html'
        }else {
                $('#err-message').text('Username and room name are required')
        }
})
