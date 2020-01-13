window.onload = function() {
    //클라이언트 소켓 생성
    var socket = io();
    //텍스트 박스에 이벤트 바인딩

    var uid = null;

    var master = null;

    var tid = null;
    var room_id = null;
//<![CDATA[
    socket.on('idd', function (response) {
        uid = response.Id;
        room_id = 'aaaa';

        var title = 'tt';
//#
        if (uid == 0) {
            socket.emit('makeRoom', {uid: uid, title: title});
        } else {
            socket.emit('joinRoom', {room_id: room_id});
        }

        socket.emit('playerList', {room_id: room_id, uid: uid});
    });

//#
    socket.on('clearCanvas', function (response) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

//#
    socket.on('changeMaster', function (response) {
        master = response.uid;
        if (master == uid) {
            $('div.draw-utility').show();
            $('#message').prop({'disabled': false});
            $('#message-button').show();
            $('#message-none').hide();
            $('div.overlay-guest').hide();
            $('#play-button').show();
            $('#answer').html('');
            $('#answer').hide();
        } else {
            $('div.draw-utility').show();
            $('#message').prop({'disabled': false});
            $('#message-button').show();
            $('#message-none').hide();
            $('div.overlay-guest').hide();
            $('#play-button').hide();
            $('#answer').html('');
            $('#answer').hide();
        }

        context.strokeStyle = '#000000';
        context.lineWidth = 1;

        $('#color-picker div').css({'background-color': '#000000'});
        $('#stroke-size > div').slider('value', 1);

        socket.emit('changeCanvasColor', {room_id: room_id, hex: '000000'});
        socket.emit('changeCanvasStroke', {room_id: room_id, stroke: 1});

        socket.emit('playerList', {room_id: room_id, uid: response.uid});
    });

//#

    //document.getElementById("eraser").onclick = getEraser();
    var el = document.getElementById("eraser");
    if (el.addEventListener)
        el.addEventListener("click", getEraser, false);
    else if (el.attachEvent)
        el.attachEvent('onclick', getEraser());

    function getEraser() {
        context.strokeStyle = '#ffffff';
        context.lineWidth = 50;

        $('#color-picker div').css({'background-color': '#ffffff'});
        $('#stroke-size > div').slider('value', 50);

        socket.emit('changeCanvasColor', {room_id: room_id, hex: 'ffffff'});
        socket.emit('changeCanvasStroke', {room_id: room_id, stroke: 50});
    }

//#

    var cl = document.getElementById("clear");
    if (cl.addEventListener)
        cl.addEventListener("click", getClear, false);
    else if (cl.attachEvent)
        cl.attachEvent('onclick', getClear());

    function getClear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('clearCanvas', {room_id: room_id});
    }


//#
    function countdown(time) {
        if (master != uid) {
            $('div.draw-utility').hide();
            $('div.overlay-guest').show();

        } else {

            $('div.draw-utility').show();
            $('div.overlay-guest').hide();

            $('#message').prop({'disabled': true});
            $('#message-button').hide();
            $('#message-none').show();
            $('#play-button').hide();
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        if (time == 3) {
            $('#countdown').fadeIn(200);
        }

        $('#countdown > div').html(time);

        if (time >= 1) {
            if (tid != null) {
                clearTimeout(tid);
            }

            tid = setTimeout(function () {
                countdown(time - 1);
            }, 1000);
        }

        if (time == 0) {
            $('#countdown').fadeOut(100);
            clearTimeout(tid);

            if (master == uid) {
                socket.emit('getQuestion', {room_id: room_id});
            }
        }
    }

//#
    socket.on('congratulationAnswer', function (response) {
        alert(response.uid + ' 님이 정답을 맞췄습니다!!');
        if (response.uid == uid) {
            socket.emit('changeMaster', {room_id: room_id, uid: response.uid});
        }
    });

    //   socket.on('checkPlayer', function(response){
    //       socket.emit('playerList', {room_id: room_id, uid: response.uid});
    //   });


    socket.on('joinRoom', function (response) {
        socket.emit('joinRoom', {room_id: response.room_id})
    });

    socket.on('playerList', function (response) {
        $('#player-list').empty();

        $('#room-title').html(response.title);
        master = response.master;
        if (master == uid) {
            $('#play-button').show();

        }

        $.each(response.list, function (key) {
            $('<span style="display:inline-block; width:100%; height:30px; line-height:30px;">' + response.uid[key] + (master == response.uid[key] ? ' <strong style="color:red;">[방장]</strong>' : '') + '</span>').appendTo($('#player-list'));
        });

        $('#player-count').html(Object.keys(response.list).length);
    });


    socket.on('playGame', function (response) {
        countdown(response.time);
    });

//#
    socket.on('getQuestion', function (response) {
        if (master == uid) {
            $('#answer').html(response.question);
            $('#answer').show();
        }
    });

    var canvas = $('#draw-tool').get(0);
    var context = canvas.getContext('2d');
    var isDraw = false;

    if (uid == master) {
    var pl = document.getElementById("clear");
    if (pl.addEventListener)
        pl.addEventListener("click", playGame(3), false);
    else if (pl.attachEvent)
        pl.attachEvent('onclick', playGame(3));

    function playGame(time) {
        socket.emit('playGame', {room_id: room_id, time: time});
    }
}

    $('#draw-tool').bind('mousedown', function(e){
        if(e.button == 0)
        {
            isDraw = true;
            context.beginPath();
            context.moveTo(e.pageX - $('#draw-tool').offset().left, e.pageY - $('#draw-tool').offset().top);
            socket.emit('initializeCanvasCoords', {room_id: room_id, x: e.pageX - $('#draw-tool').offset().left, y: e.pageY - $('#draw-tool').offset().top});
        }
    });

    $('#draw-tool').bind('mouseup', function(e){
        if(e.button == 0)
        {
            isDraw = false;
            context.lineTo(e.pageX - $('#draw-tool').offset().left, e.pageY - $('#draw-tool').offset().top);
            context.stroke();
            context.closePath();
            socket.emit('drawCanvasCoords', {room_id: room_id, x: e.pageX - $('#draw-tool').offset().left, y: e.pageY - $('#draw-tool').offset().top, close: true});
        }
    });

    $('#draw-tool').bind('mousemove', function(e){
        if(isDraw == true)
        {
            context.lineTo(e.pageX - $('#draw-tool').offset().left, e.pageY - $('#draw-tool').offset().top);
            context.stroke();
            socket.emit('drawCanvasCoords', {room_id: room_id, x: e.pageX - $('#draw-tool').offset().left, y: e.pageY - $('#draw-tool').offset().top, close: false});
        }
    });

//#
    $('#color-picker').ColorPicker({
        color: '#000000',
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb){
            $('#color-picker div').css({'background-color':'#' + hex});
            context.strokeStyle = '#' + hex;
            socket.emit('changeCanvasColor', {room_id: room_id, hex: hex});
        }
    });

//#
    $('#stroke-size div').slider({
        range: 'max',
        min: 1,
        max: 10,
        value: 1,
        slide: function(event, ui){
            $('#stroke-size > span').html(ui.value);
            context.lineWidth = ui.value;
            socket.emit('changeCanvasStroke', {room_id: room_id, stroke: ui.value});
        }
    });

    var ssl = document.getElementById("message-button");
    if (ssl.addEventListener)
        ssl.addEventListener("click", sendMessage, false);
    else if (ssl.attachEvent)
        ssl.attachEvent('onclick', sendMessage);


    var div = document.getElementById('chatting-list');
    var txt = document.getElementById('message');
    txt.focus();

    txt.onkeydown = sendMessage.bind(this);

    function sendMessage(event) {
        if (event.keyCode == 13) {
            var mess = event.target.value;
            if (message) {
                //소켓서버 함수 호출
                socket.emit('sendMessage', {room_id: room_id, uid: uid, msg: mess});
                //텍스트박스 초기화
                txt.value = '';
            }
        }
    }


    socket.on('displayMessage', function(response){

        var message = '['+ response.nickname + '님의 말' + '] ' + response.msg;
        div.innerText += message + '\r\n';
        //채팅창 스크롤바 내리기
        div.scrollTop = div.scrollHeight

        //$('#chatting-list').html($('#chatting-list').html() + '<br />[' + response.nickname + '] ' + response.msg);
        //$('#chatting-list').scrollTop($('#chatting-list').prop('scrollHeight'));
    });

//#
    socket.on('initializeCanvasCoords', function(response){
        context.beginPath();
        context.moveTo(response.x, response.y);
    });

//#
    socket.on('drawCanvasCoords', function(response){
        context.lineTo(response.x, response.y);
        context.stroke();
        if(response.close == true) context.closePath();
    });

//#
    socket.on('changeCanvasColor', function(response){
        $('#color-picker div').css({'background-color':'#' + response.hex});
        context.strokeStyle = '#' + response.hex;
    });

//#
    socket.on('changeCanvasStroke', function(response){
        context.lineWidth = response.stroke;
        $('#stroke-size > div').slider('value', response.stroke);
        //$('#stroke-size > span').html(response.stroke);
    });



};
