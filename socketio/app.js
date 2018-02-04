var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var index = require('./route/index');
app.use('/',index);

app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static('public'));

io.on('connection', function(socket) {

    socket.on('login', function(data) {
        console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
        socket.name = data.name;
        socket.userid = data.userid;
        io.emit('login', data.name );// 접속된 모든 클라이언트에게 메시지를 전송한다
    });

    // 클라이언트로부터의 메시지가 수신되면
    socket.on('chat', function(data) {
        console.log('Message from %s: %s', socket.name, data.msg);

        var msg = {
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg
        };

        // 접속된 모든 클라이언트에게 메시지를 전송한다
         io.emit('s2c chat', msg);
    });

    // force client disconnect from server
    socket.on('forceDisconnect', function() {
        socket.disconnect();
    });

    socket.on('disconnect', function() {
        console.log('user disconnected: ' + socket.name);
    });
});

server.listen(81, '0.0.0.0', function() {
    console.log('Socket IO server listening on port 81');
});
