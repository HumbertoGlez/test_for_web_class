const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { response } = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cors())

// Connect to MongoDB.
console.log("Connecting to MongoDB database...");
mongoose.connect('mongodb://localhost/rps_game', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
// On error...
db.on('error', console.error.bind(console, 'Connection error:'));

// On success...
db.once('open', function() {
    
    console.log("Connected to MongoDB database.");

    const gameSchema = new mongoose.Schema({
        gameID: { type: String, required: true, unique: true},
        player1: { 
            playerID: {
                type: String, required: true, unique: true
            },
            command: {
                type: Number
            }
        },
        player2: { 
            playerID: {
                type: String, unique: true
            },
            command: {
                type: Number
            }
        }
    });

    const Game = mongoose.model('Game', gameSchema);

    ///-- ROUTES

    // Ignore favicon.
    app.get('/favicon.ico', (req, res) => res.status(204));

    // Create game
    app.post('/create/:username', async (req, res) => {
        let newGame = new Game();

        newGame.gameID = '_' + Math.random().toString(36).substr(2, 9);
        newGame.player1.playerID = req.params["username"];
        newGame.player1.command = 0;
        
        const result = await Game.findOne({gameID: newGame.gameID}).exec();
        while (result != null) {
            newGame.gameID = '_' + Math.random().toString(36).substr(2, 9);
            result = await Game.findOne({gameID: newGame.gameID}).exec();
        }
        newGame.save(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
        res.send("success:" + newGame.gameID);
    });

    // Get game status
    app.get('/getGame/:gameID', async (req, res) => {
        const gameID = req.params["gameID"];
        const result = await Game.findOne({gameID: gameID}).exec();

        if (result != null) {
            console.log("Sending game data to client...");
            res.send(result);
        }
        else {
            console.log("A game with ID ('" + gameID + "') does not exists.");
            res.send("error: game_notFound");
        }
    });

    // Join game
    app.put('/join/:gameID,:username', async (req, res) => {
        const gameID = req.params["gameID"];
        const playerID = req.params["username"];

        const result = await Game.findOne({gameID: gameID, player1:{ playerID: playerID}}).exec();
        if (result != null) {
            console.log("A player with the same name ('" + playerID + "') already exists.");
            res.send("error:duplicate_name");
        }

        await Game.updateOne({gameID: gameID}, {player2:{playerID: playerID, command: 0}},
            function (err, res2) {
                if (err) {
                    console.log(err);
                    res.send("error:game_notFound");
                }
                else {
                    console.log(res2);
                    res.send("success:" + gameID);
                }
            }
        );
    });

    // Command
    app.put('/command/:gameID,:isP1,:command,:username', async (req, res) => {
        const gameID = req.params["gameID"];
        let isP1 = req.params["isP1"];
        let command = req.params["command"];
        let username = req.params["username"];
        console.log(isP1);
        if (isP1 == 1) {
            await Game.updateOne({gameID: gameID}, {$set: {"player1.command": command}},
                function (err, res2) {
                    if (err) {
                        console.log(err);
                        res.send("error:game_not_found");
                    }
                    else {
                        console.log(res2);
                        res.send("success");
                    }
                }
            );
        }
        else {
            await Game.updateOne({gameID: gameID}, {$set: {"player2.command": command}},
                function (err, res2) {
                    if (err) {
                        console.log(err);
                        res.send("error:game_not_found");
                    }
                    else {
                        console.log(res2);
                        res.send("success");
                    }
                }
            );
        }
    });

    app.listen(port)
});