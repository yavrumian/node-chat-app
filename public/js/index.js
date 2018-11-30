var socket = io.connect();
function isRealString (str){
    return typeof str === 'string' && str.trim().length > 0;
}

function genRandom(len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

$('.random-button').tooltip({
    content: 'Generate random room name',
    classes:{
        'ui-tooltip': 'custom-black'
    }
});

$('#join-button').click(function (event) {
        event.preventDefault();
        if(isRealString($('input[name=room]').val()) && isRealString($('input[name=name]').val())){
            socket.emit('data', {
                room: $('input[name=room]').val().toLowerCase(),
                name: $('input[name=name]').val()
            })
            window.location.href = '/chat.html'
        }else {
                $('#err-message').text('Username and room name are required')
        }
})

$('.random-button').click(function(event){
    event.preventDefault();
    $('.room-field').val(genRandom(10));
})
$('.random-button').mouseup(function(event){
    event.preventDefault();
    $('.random-button').tooltip('close')
})
