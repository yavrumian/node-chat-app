var socket = io.connect();
alert(btoa('heey'))
const room = atob(decodeURIComponent($.deparam().room));
const name = atob(decodeURIComponent($.deparam().name));
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
