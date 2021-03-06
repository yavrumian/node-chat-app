var socket = io.connect();
var room = Base64.decode(decodeURIComponent($.deparam().room));
var name = Base64.decode(decodeURIComponent($.deparam().name));
function isRealString (str){
    return typeof str === 'string' && str.trim().length > 0;
}

$('#room-name').text(room);
$('#user-name').text(name);
$('button').click(function (event) {
        event.preventDefault();
        if(isRealString(room) && isRealString($('input[name=name]').val())){
            socket.emit('data', {
                room,
                name: $('input[name=name]').val()
            })
            window.location.href = '/chat.html'
        }else{
            $('#err-message').text('Username is required*');
        }
})
