let io = socket(server)
io.on('connection', function(socket){
  console.log(`${socket.id} is connected`);

    socket.on('disconnect', function() {
        console.log(`${socket.id} has left`);
    });
});
