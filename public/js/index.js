var socket = io.connect();
var isSecret = false;
var actRooms;

if(Cookies.get('room') && Cookies.get('name')){
    socket.emit('data', {
        room: Cookies.get('room'),
        name: Cookies.get('name')
    })
    window.location.href = '/chat.html'
}else if(!Cookies.get('room') && Cookies.get('name')){
    $('input[name=name]').val(Cookies.get('name'))
}

socket.on('updateRoomList', (activeRooms) => {
    $('#drop').html('');
    actRooms = activeRooms;
    if(activeRooms[0]){
        for(var x = 0; x < activeRooms.length; x++){
            var a = $('<a></a>');
            a.append($('<b></b>').text(activeRooms[x].name));
            a.append($('<span></span>').text(activeRooms[x].count));
            $("#drop").append(a)
        }
        $('#drop a').click(function(e){
            e.preventDefault();
            $('#drop-btn').addClass('selected').text($("b", this).text()).append($('<i class="fas fa-sort-down">'));
            $('.refresh-btn').css('border' , '2.5px solid #265f82')
            $('.room-field').val($("b", this).text());
            $('.checkbox').addClass('disabled')
        })
    }else{
        $('#drop').append($('<span></span>').text('Sorry. There\'re no any active rooms'))
    }
})

function isRealString (str){
    return typeof str === 'string' && str.trim().length > 0;
}

function customTrim(x) {
    return x.replace(/ +(?= )/g,'');
}

$(document).ready(function(){
    socket.emit('refreshRoomList', {})
})

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
            Cookies.set('room', customTrim($('input[name=room]').val().toLowerCase()), {expires: 2});
            Cookies.set('name', customTrim($('input[name=name]').val().trim()), {expires: 2});
            socket.emit('data', {
                room: customTrim($('input[name=room]').val().toLowerCase()),
                name: customTrim($('input[name=name]').val().trim()),
                isSecret
            })
            window.location.href = '/chat.html'
        }else {
                $('#err-message').text('Username and room name are required*')
        }
})

$('.random-button').click(function(event){
    event.preventDefault();
    $('.room-field').val(genRandom(10));
})
$('.random-button').mouseup(function(event){
    event.preventDefault();
    setTimeout(function(){
        $('.random-button').tooltip('close')
    }, 1500)
})
$('.checkbox').click(function(){
    if(isSecret === false && !$(this).hasClass('disabled')) {
        $(this).css({
            'background-color': '#265f82'
        });
        $('.fa-check').css('visibility', 'visible');
        isSecret = true;
    }else if ($(this).hasClass('disabled')) {

    }else{
        $(this).css({
            'background-color': 'white'
        });
        $('.fa-check').css('visibility', 'hidden');
        isSecret = false;
    }
})
$('#drop-btn').click(function(e){
    e.preventDefault();
    $('#drop').toggle('show')
})
$(document).click(function(e) {
    if (!$('#drop').is(e.target) && !$('#drop-btn').is(e.target) && !$('#refresh').is(e.target) && $('#drop').has(e.target).length === 0)
    {
        $('#drop').hide();
    }
});
$('.room-field').focusout(function(){
    var exist = actRooms.some(function(room){
        return customTrim($('.room-field').val().toLowerCase()) === room.name;
    })
    if(exist){
        $('.checkbox').addClass('disabled');
    }else{
            $('.refresh-btn').css('border' , '2.5px solid #265f82')
        $('#drop-btn').removeClass('selected').text('Choose from active rooms').append($('<i class="fas fa-sort-down">'));
        $('.checkbox').removeClass('disabled');
    }
})
var deg = 0;
$('#refresh').click(function(e){
    deg += 180;
    e.preventDefault()
    socket.emit('refreshRoomList', {});
    $('i', this).css({
        '-webkit-transform' : 'rotate(' + deg + 'deg)',
        '-moz-transform' : 'rotate(' + deg + 'deg)',
        '-ms-transform' : 'rotate(' + deg + 'deg)',
        '-o-transform' : 'rotate(' + deg + 'deg)',
        'transform' : 'rotate(' + deg + 'deg)'
    })
})
