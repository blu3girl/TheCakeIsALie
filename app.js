// const express = require('express');
const logger = require('morgan');
// const http = require('http');
// var PORT = process.env.PORT || 3000;



var express = require('express');
const path = require('path');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(logger('dev'));
var socket = require('socket.io')

app.get("/", (req, res) => {
    res.render('homepage')
})

var server = app.listen(3000, () => {
    console.log('listening for requests on port 3000');
});

// https://stackoverflow.com/questions/27393705/how-to-resolve-a-socket-io-404-not-found-error




// var app = express();

// app.set('view engine', 'ejs');
// app.use(logger('dev'));
// app.use(express.static(path.join(__dirname, 'public')));


io_server = require('./server/io_server')(server, socket, app)








// var server = app.listen(3000)

// var io = require('socket.io').listen(server);

// io.on('connection', function(socket) {
//     socket.on('new player', function(data) {
//         console.log('NEW PLAYER');
//     });
//     socket.on('disconnect', function() {
//         console.log('LEAVE PLAYER');
//     });
// });