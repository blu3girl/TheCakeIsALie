const WebSocket = require('ws')
const port = (process.env.PORT) ? process.env.PORT : 8080
const wss = new WebSocket.Server({ port: port }, () => {
    console.log('server started')
})

let game_state = {}
let word_bank = [
    ["Baguette", "Baton"],
    ["Yoga", "Having a Leg Cramp"],
    ["Snake", "Rope"]
]

const init_game_state = () => {
    // Reset Game State, set initial default values
    game_state = {}

    game_state["Current_Phase"] = "Lobby";
    game_state["Time_To_Next_Phase"] = null;
    game_state["Current_Players"] = {};
}

init_game_state_drawing = () => {
    let random_imposter_index = ~~(Math.random() * Object.keys(game_state["Current_Players"]).length);
    let random_word_bank = ~~(Math.random() * 3);
    let random_word_pick = ~~(Math.random() * 2);

    game_state["Current_Phase"] = "Drawing";
    game_state["Time_To_Next_Phase"] = 10
    game_state["Imposter"] = Object.keys(game_state["Current_Players"])[random_imposter_index],
    game_state["Word_Good"] = word_bank[random_word_bank][random_word_pick],
    game_state["Word_Bad"] = word_bank[random_word_bank][(random_word_pick + 1) % 2]
    game_state["Images"] = {}

    console.log('Drawing Game State', game_state)
}

init_game_state_voting = () => {
    game_state["Current_Phase"] = "Voting";
    game_state["Time_To_Next_Phase"] = 10
    game_state["Votes"] = {};

    console.log('Voting Game State', game_state)
}

init_game_state_results = () => {
    game_state["Current_Phase"] = "Results";
    game_state["Time_To_Next_Phase"] = 10
}

setInterval(() => {
    let phase = game_state["Current_Phase"];
    let time_to_next_phase = game_state["Time_To_Next_Phase"];
    console.log(phase, time_to_next_phase)

    if(phase == 'Lobby') {
        let total_players = Object.keys(game_state["Current_Players"]).length

        if(!time_to_next_phase && total_players >= 3) {
            game_state["Time_To_Next_Phase"] = 3
        }
    }

    if(time_to_next_phase != null) {
        if (time_to_next_phase > 0) {
            game_state["Time_To_Next_Phase"] -= 1;
        } else {
            console.log("NEW PHASE")
            if(phase == 'Lobby') {
                init_game_state_drawing();
            }
            if(phase == 'Drawing') {
                init_game_state_voting();
            }
            if(phase == 'Voting') {
                init_game_state_results();
            }
            if(phase == 'Results') {
                init_game_state();
            }
        }
    }

    if(phase == 'Drawing') {
        let total_images = Object.keys(game_state["Images"]).length
        let total_players = Object.keys(game_state["Current_Players"]).length

        if(total_images == total_players) {
            init_game_state_voting();
        }
    }
    
    if(phase == 'Voting') {
        let total_votes = Object.keys(game_state["Votes"]).length
        let total_players = Object.keys(game_state["Current_Players"]).length

        if(total_votes == total_players) {
            init_game_state_results();
        }
    }

}, 1000)


const GET_game_state = (data) => {
    // Check if current player is in the game or not. 
    let name = data.name
    let id = data.id

    if (!(id in game_state["Current_Players"])) {
        console.log("Adding existing user", name, id, "to the game")
        POST_new_player({
            name,
            id
        })
    }

    return game_state;
}

const POST_new_player = (data) => {
    
    let name = data.name
    let id = (data.id) ? data.id : Math.random().toString(16).slice(2)

    // Add a player to the game state
    if(! (id in game_state["Current_Players"])) {
        console.log("Adding", name, id, "to the game")
        game_state["Current_Players"][id] = name
    }

    return id
}

const POST_new_image = (data) => {
    console.log(data.id, 'posted image')
    game_state["Images"][data.id] = data.photo
}

const POST_new_vote = (data) => {
    console.log(data.id, 'voted for', data.person_voted_id)
    game_state["Votes"][data.id] = data.person_voted_id
}

const new_message = (input, ws) => {
    console.log("nm", input.message)
    
    if (!Buffer.isBuffer(input)) { console.log("ERROR: INVALID DATA TYPE"); return; }
    let parsed = JSON.parse(input);
    // For anything not testing, uncomment the top two lines
    // let parsed = input;

    let message = parsed['message']
    let data = JSON.parse(parsed['data'])

    if(message == "POST_new_player") {
        ws.send(JSON.stringify(POST_new_player(data)));
    }
    
    if(message == "GET_game_state") {
        ws.send(JSON.stringify(GET_game_state(data)));
    }

    if(message == "POST_new_image") {
        POST_new_image(data)
    }

    if(message == "POST_new_vote") {
        POST_new_vote(data)
    }

    if(message == "POST_init_game") {
        init_game_state()
    }
}

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        new_message(data, ws)
    });
})


const play_example_game = () => {
    console.log("Playing an example game")
    init_game_state();

    let p1 = new_message({
        message: "POST_new_player",
        data: {
            name: "Nathan"
        }
    })
    let p2 = new_message({
        message: "POST_new_player",
        data: {
            name: "Dylan"
        }
    })
    let p3 = new_message({
        message: "POST_new_player",
        data: {
            name: "Blue"
        }
    })

    setTimeout(() => {
        new_message({
            message: "POST_new_image",
            data: {
                id: p2,
                photo: "Example long text (p2)"
            }
        })
    
        new_message({
            message: "POST_new_image",
            data: {
                id: p1,
                photo: "Example long text (p1)"
            }
        })
    

    }, 7000)

    setTimeout(() => {
        console.log(new_message({
            message: "GET_game_state",
            data: {
                id: p1,
                name: "Nathan"
            }
        }))
    }, 10000)

    setTimeout(() => {
        new_message({
            message: "POST_new_image",
            data: {
                id: p3,
                photo: "Example long text (p3) LAST"
            }
        })
    }, 12000)


    setTimeout(() => {
        new_message({
            message: "POST_new_vote",
            data: {
                id: p2,
                person_voted_id: p1
            }
        })
    
        new_message({
            message: "POST_new_vote",
            data: {
                id: p3,
                person_voted_id: p1
            }
        })
    
    }, 17000)


    setTimeout(() => {
        new_message({
            message: "POST_new_vote",
            data: {
                id: p1,
                person_voted_id: p2
            }
        })
    }, 19000)

    setTimeout(() => {
        console.log(new_message({
            message: "GET_game_state",
            data: {
                id: p1,
                name: "Nathan"
            }
        }))
    }, 22000)

    setTimeout(() => {
        console.log(new_message({
            message: "GET_game_state",
            data: {
                id: p1,
                name: "Nathan"
            }
        }))
    }, 33000)

    setTimeout(() => {
        console.log(new_message({
            message: "GET_game_state",
            data: {
                id: p2,
                name: "Dylan"
            }
        }))
    }, 34000)

    setTimeout(() => {
        console.log(new_message({
            message: "GET_game_state",
            data: {
                id: p3,
                name: "Blue"
            }
        }))
    }, 36000)
}

// play_example_game();

wss.on('listening', () => {
    console.log('server is listening on port 8080')
})