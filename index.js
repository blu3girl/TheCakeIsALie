const WebSocket = require('ws')
const wss = new WebSocket.Server({port: 8080}, ()=>{
    console.log('server started')
})

var game_state = {
    game_phase: "drawing",
    players: [1, 2, 3, 4, 5],
    imposter: [1]
}

wss.on('connection',(ws)=>{
    ws.on('message',(data)=>{
        if (Buffer.isBuffer(data)) {
            console.log("it's a buffer!!!")

            var buf =  data.toString("utf8");
            if(buf == 'Hello') {
                ws.send(JSON.stringify(game_state))
            } 
        }

        else {
            ws.send("You suck, THIS IS EXAMPLE DATA")
        }
    });

    ws.on('send_game_state',(data)=>{
        ws.send(JSON.stringify(game_state))
    });
})


wss.on('listening',()=>{
    console.log('server is listening on port 8080')
})