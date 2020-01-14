var path = require('path');
var express = require('express');
var app = express();
var url = require("url");
var logger=require('morgan');

var indexRouter = require('./router/rr');

app.set('port', (process.env.PORT || 80));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view 경로 설정
app.set('views', __dirname );

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));
app.use('/', indexRouter);
module.exports = app;


//app.get("/", function(req, res){
//	console.log("get:detail_temp.html");
	//최초 루트 get 요청에 대해, 서버에 존재하는 chatClient.html 파일 전송
	// res.send("detail_temp.html", {root: __dirname});
//	res.render("detail_temp.html");
//});



app.use(function(req, res){
	var fileName = url.parse(req.url).pathname.replace("/","");
	res.sendFile(fileName, {root: __dirname});
	console.log("use:", fileName);
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

var server = require('http').createServer(app);
server.listen(80);
console.log("listening at http://192.249.19.253:4480...");


var io = require('socket.io').listen(server);


//# 
var questions = [
'수박',
'사과',
'만두',
'달력',
'치약',
'칫솔',
'빨대',
'컵',
'시계',
'선풍기',
'화분',
'지갑',
'열쇠',
'담배',
'쿠폰',
'휴대폰',
'책상',
'의자',
'바람',
'해',
'달',
'별',
'구름',
'나무',
'칼',
'가스렌지',
'전자렌지',
'냉장고',
'무우',
'파스타',
'얼음',
'콜라',
'사이다',
'초코파이',
'회사',
'축구',
'야구',
'축구',
'배구',
'킬러',
'독수리',
'사자',
'곰',
'호랑이'
];

//#
var room_master = {};

var room_title = {};

var room_question = {};

var room_uid = {};

var uniqueID = (function(){
	var id=0;
	return function(){ return id++; }; //실제 아이디를 받아오면 됨
})();

//# 
io.on('connection', function(socket){
	var clientID = uniqueID();
	console.log('Connection: '+ clientID);
	io.sockets.emit('idd',{Id:clientID});


	socket.on('changeMaster', function(response){
		console.log('change');
		room_master[response.room_id] = response.uid;
		io.sockets.in(response.room_id).emit('changeMaster', {room_id: response.room_id, uid: response.uid});
	});


	socket.on('joinRoom', function(response){
			console.log('join'+socket.id);
			socket.join(response.room_id);
			room_title[id] = response.title;

	});

	socket.on('sendMessage', function(response){
		console.log('message');
		io.sockets.in(response.room_id).emit('displayMessage', {nickname: response.uid, msg: response.msg});
		if(response.msg == room_question[response.room_id])
		{
			io.sockets.in(response.room_id).emit('congratulationAnswer', {uid: response.uid});
		}
	});

	//#
	socket.on('playGame', function(response){
		console.log('play');
		io.sockets.in(response.room_id).emit('playGame', {time: response.time});
	});

	socket.on('getQuestion', function(response){
		console.log('getQ');
		room_question[response.room_id] = questions[Math.floor((Math.random() * ((questions.length - 1) - 0 + 1)) + 0)];
		io.sockets.in(response.room_id).emit('getQuestion', {question: room_question[response.room_id]});
	});

	socket.on('em',function (response) {
		console.log('emem')
	})
	socket.on('makeRoom', function(response){
		console.log('make')
		var id = 'aaaa';

		//socket.join(id);
		room_master[id] = response.uid;
		room_title[id] = response.title;

		socket.join(id)
	});


	socket.on('getRoomList', function(response){
		socket.emit('getRoomList', {room: getRoomList()});
	});


	socket.on('playerList', function(response) {
		if (room_uid[socket.id] == null) {
		room_uid[socket.id] = response.uid;
	}

		console.log('list');
		io.sockets.in(response.room_id).emit('playerList', {
			title: room_title[response.room_id],
			list: io.sockets.adapter.rooms[response.room_id].sockets,
			uid: room_uid,
			master: room_master[response.room_id],
		});
		console.log(room_master[response.room_id])
	});

	//#
        socket.on('initializeCanvasCoords', function(response){
                socket.broadcast.to(response.room_id).emit('initializeCanvasCoords', {x: response.x, y: response.y});
        });

        //#
        socket.on('drawCanvasCoords', function(response){
		socket.broadcast.to(response.room_id).emit('drawCanvasCoords', {x: response.x, y: response.y, close: response.close});
        });

	//#
        socket.on('changeCanvasColor', function(response){
                socket.broadcast.to(response.room_id).emit('changeCanvasColor', {hex: response.hex});
        });

	//#
        socket.on('changeCanvasStroke', function(response){
                socket.broadcast.to(response.room_id).emit('changeCanvasStroke', {stroke: response.stroke});
        });

	//# 
	socket.on('clearCanvas', function(response){
		socket.broadcast.to(response.room_id).emit('clearCanvas');
	});

        //#
        socket.on('disconnect', function(){
        	io.sockets.emit('checkPlayer');
		console.log('disconnected');
        });
});
