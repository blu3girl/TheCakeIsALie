const WebSocket = require('ws')
const port = (process.env.PORT) ? process.env.PORT : 8080
const wss = new WebSocket.Server({ port: port }, () => {
    console.log('server started')
})

var game_state = {
    game_phase: "drawing",
    players: [1, 2, 3, 4, 5],
    imposter: [1]
}

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        if (Buffer.isBuffer(data)) {
            console.log("it's a buffer!!!")
            let parsed = JSON.parse(data);
            console.log(parsed);
            if (parsed.message == 'get_state') {
                ws.send(JSON.stringify(game_state))
            }
        }
    });

    ws.on('send_game_state', (data) => {
        ws.send(JSON.stringify(game_state))
    });
})


wss.on('listening', () => {
    console.log('server is listening on port 8080')
})