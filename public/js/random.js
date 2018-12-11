var socket = io.connect();
function isRealString (str){
    return typeof str === 'string' && str.trim().length > 0;
}
$('button').click(function (event) {
        event.preventDefault();
        if(isRealString($('input[name=name]').val())){
            socket.emit('data', {
                name: $('input[name=name]').val(),
                isSecret: true,
                isRandom: true
            })
            window.location.href = '/chat.html'
        }else{
            $('#message').css('color', 'red').text('Username is required*');
        }
})
