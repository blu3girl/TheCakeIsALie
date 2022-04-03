module.exports = (server, socket, app) => {

    let io = socket(server)
   
   
   
   
   
   
    let game_state = {}
    let word_bank = [
        ["Baguette", "Baton"],
        ["Yoga", "Having a Leg Cramp"],
        ["Snake", "Rope"]
    ]
    
    const init_game_state = () => {
        // Reset Game State, set initial default values

        game_state["Current_Phase"] = "Lobby";
        game_state["Time_To_Next_Phase"] = null;
        game_state["Imposter"] = undefined;
        game_state["Word_Good"] = undefined;
        game_state["Word_Bad"] = undefined;
        game_state["Images"] = undefined;
        game_state['Votes'] = undefined;
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
    
        // if(phase == 'Lobby') {
        //     let total_players = Object.keys(game_state["Current_Players"]).length
    
        //     if(!time_to_next_phase && total_players >= 3) {
        //         game_state["Time_To_Next_Phase"] = 3
        //     }
        // }
    
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

        for(var player in game_state["Current_Players"]) {
            io.emit(player, game_state)
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
        let id = data.id
    
        // Add a player to the game state
        if(! (id in game_state["Current_Players"])) {
            console.log("Adding", name, id, "to the game")
            game_state["Current_Players"][id] = name
        }
    
        return id
    }
    
    const POST_leave_player = (id) => {
        if (id in game_state['Current_Players']) {
            delete game_state["Current_Players"][id];
        }
    }

    const POST_new_image = (data) => {
        console.log(data.id, 'posted image')
        game_state["Images"][data.id] = data.photo
    }
    
    const POST_new_vote = (data) => {
        console.log(data.id, 'voted for', data.person_voted_id)
        game_state["Votes"][data.id] = data.person_voted_id
    }
    
    
    const new_message = (input) => {
        console.log("nm", input.message)
        
        // if (!Buffer.isBuffer(input)) { console.log("ERROR: INVALID DATA TYPE"); return; }
        // let parsed = JSON.parse(input);
        // For anything not testing, uncomment the top two lines
        let parsed = input;
    
        let message = parsed['message']
        let data = parsed['data']
    
        if(message == "POST_new_player") {
            return POST_new_player(data);
        }
        
        if(message == "GET_game_state") {
            return GET_game_state(data)
        }
    
        if(message == "POST_new_image") {
            return POST_new_image(data)
        }
    
        if(message == "POST_new_vote") {
            return POST_new_vote(data)
        }
    }

    io.on('connection', function(socket){
        console.log(`${socket.id} is connected`);

        socket.on('disconnect', function() {
            console.log(`${socket.id} has left`);
            POST_leave_player(socket.id)
        });

        socket.on('POST_new_player', function(data) {
            // console.log("POST_new_player", data)
            POST_new_player(data);
        })

        socket.on('POST_new_image', function(data) {
            POST_new_image(data);
        })
    });
    
    init_game_state()
    game_state["Current_Players"] = {};

    app.get("/start-game", (req, res) => {
        let total_players = Object.keys(game_state["Current_Players"]).length
        let phase = game_state["Current_Phase"];

        if(phase == 'Lobby') {
            if(total_players >= 3) {
                game_state["Time_To_Next_Phase"] = 3
                res.statusCode = 200
                res.send("Game Starting")
            } else {
                res.statusCode = 400
                res.send("NOT ENOUGH PEOPLE")
            }
        } else {
            res.statusCode = 400
            res.send("NOT CORRECT STATE")
        }

    })
    
    app.get('/get-game-data', (req, res) => {
        res.json(game_state)
    })
}
