// Handler for the 'create game' action.
let create_game_handler = (_) => {

    let nameField = document.getElementById("card-name-create");
    let username = nameField.value.trim();


    nameField.value = "";
    nameField.focus();
    nameField.select();

    // If the field is empty, don't add it.
    if (username === "") {
        return;
    }

    axios
        .post(`http://localhost:8080/create/${username}`) 
        .then(resp => {

            if (resp.data.includes("success")) {
                alert("Game created succesfully!");
                document.getElementById("LobbyActions").style.display = "none";
                document.getElementById("infoPane").style.display = "block";
                document.getElementById("game").style.display = "block";
                let myID = resp.data.split("success:")[1];
                document.getElementById("gameIDTitle").innerText = myID;
                document.getElementById("playerIDTitle").innerText = username;
                document.getElementById("p2-buttons").style.display = "none";
                document.getElementById("p1-buttons").style.display = "flex";
                let isPlayer1 = 1;

                setTimeout(function(){ get_game_handler(myID, isPlayer1); }, 5000);
                return;
            }
            else {
                if (resp.data == "error") {
                    alert("The game could not be created. Please try again.");
                } else {
                    alert(`The card could not be created. (${resp.data})`);
                }
            return;
            }
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining the data.");
        });
}

// Handler for the 'join game' action.
let join_game_handler = (_) => {

    let nameField = document.getElementById("card-name-get");
    let username = nameField.value.trim();
    let gameIDField = document.getElementById("card-game-get").value;


    nameField.value = "";
    nameField.focus();
    nameField.select();

    // If the field is empty, don't get it.
    if (username === "" || gameIDField === "") {
        return;
    }

    axios
        .put(`http://localhost:8080/join/${gameIDField},${username}`)
        .then(resp => {

            if (resp.data.includes("error")) {
                alert(`The game could not be joined. (${resp.data})`);
                return;
            } else if (resp.data.includes("success")) {
                alert("Game joined succesfully!");
                document.getElementById("LobbyActions").style.display = "none";
                document.getElementById("infoPane").style.display = "block";
                document.getElementById("game").style.display = "block";
                let myID = resp.data.split("success:")[1];
                document.getElementById("gameIDTitle").innerText = myID;
                document.getElementById("playerIDTitle").innerText = username;
                document.getElementById("p1-buttons").style.display = "none";
                document.getElementById("p2-buttons").style.display = "flex";
                let isPlayer1 = 0;
                setTimeout(function(){ get_game_handler(myID, isPlayer1); }, 5000);
                return;
            }
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining the data.");
        });
};

// Handler for the 'Get game state' action.
let get_game_handler = (gameID, isP1) => {
    let thisID = gameID;
    
    axios
        .get(`http://localhost:8080/getGame/${thisID}`)
        .then(resp => {
            if (typeof(resp.data) === 'string' && resp.data.includes("error")) {
                alert(`The game could not be obtained. (${resp.data})`);
                return;
            }
            let currentImg = document.getElementById("p1Command");
            switch(resp.data.player1.command) {
                case 1:
                    if (currentImg.src != "rockCommand.png" && isP1 == 1) document.getElementById("p1Command").src = "rockCommand.png";
                    else if (currentImg.src != "rockCommand.png" && isP1 == 0) document.getElementById("p1Command").src = "ready.png";
                    break;
                case 2:
                    if (currentImg.src != "paperCommand.png" && isP1 == 1) document.getElementById("p1Command").src = "paperCommand.png";
                    else if (currentImg.src != "paperCommand.png" && isP1 == 0) document.getElementById("p1Command").src = "ready.png";
                    break;
                case 3:
                    if (currentImg.src != "scissorsCommand.png" && isP1 == 1) document.getElementById("p1Command").src = "scissorsCommand.png";
                    else if (currentImg.src != "scissorsCommand.png" && isP1 == 0) document.getElementById("p1Command").src = "ready.png";
                    break;
                default:
                    if (currentImg.src != "thinking.png") document.getElementById("p1Command").src = "thinking.png";
            }
            let currentImg2 = document.getElementById("p2Command");
            if (resp.data.player2) {
                switch(resp.data.player2.command) {
                    case 1:
                        if (currentImg2.src != "rockCommand.png" && isP1 == 0) document.getElementById("p2Command").src = "rockCommand.png";
                        else if (currentImg2.src != "rockCommand.png" && isP1 == 1) document.getElementById("p2Command").src = "ready.png";
                        break;
                    case 2:
                        if (currentImg2.src != "paperCommand.png" && isP1 == 0) document.getElementById("p2Command").src = "paperCommand.png";
                        else if (currentImg2.src != "paperCommand.png" && isP1 == 1) document.getElementById("p2Command").src = "ready.png";
                        break;
                    case 3:
                        if (currentImg2.src != "scissorsCommand.png"  && isP1 == 0) document.getElementById("p2Command").src = "scissorsCommand.png";
                        else if (currentImg2.src != "scissorsCommand.png" && isP1 == 1) document.getElementById("p2Command").src = "ready.png";
                        break;
                    default:
                        if (currentImg2.src != "thinking.png") document.getElementById("p2Command").src = "thinking.png";
                }
            }
            // Check is someone won
            let img1 = document.getElementById("p1Command");
            let img2 = document.getElementById("p2Command");
            console.log(img1.src.substr(img1.src.lastIndexOf('/')) + "\n" + img2.src.substr(img2.src.lastIndexOf('/')));
            if (img1.src.substr(img1.src.lastIndexOf('/')) != "/thinking.png" && img2.src.substr(img2.src.lastIndexOf('/')) != "/thinking.png") {
                check_victory(thisID, isP1, resp.data.player1.command, resp.data.player2.command);
            }
            else {
                setTimeout(function(){ get_game_handler(thisID, isP1); }, 5000);
            }
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining the data.");
        });
}

let check_victory = (gameID, isP1, p1Move, p2Move) => {
    let img1 = document.getElementById("p1Command");
    let img2 = document.getElementById("p2Command");
    if (isP1 == 1) {
        if (p2Move == 1) img2.src = "rockCommand.png";
        else if (p2Move == 2) img2.src = "paperCommand.png";
        else if (p2Move == 3) img2.src = "scissorsCommand.png";
    }
    else if (isP1 == 0) {
        if (p1Move == 1) img1.src = "rockCommand.png";
        else if (p1Move == 2) img1.src = "paperCommand.png";
        else if (p1Move == 3) img1.src = "scissorsCommand.png";
    }

    if (p1Move == 1 && p2Move == 3) {
        if (isP1) {
            swal({
                title: "You win!", 
                text: "yeeeeeeeeeaaaaaaah boiiiiiiiiiii!", 
                icon: "success",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);

                }
            });
        }
        else {
            swal({
                title: "You lose!", 
                text: "get good :p", 
                icon: "error",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
        
    }
    else if (p1Move == 1 && p2Move == 2) {
        if (!isP1) {
            swal({
                title: "You win!", 
                text: "yeeeeeeeeeaaaaaaah boiiiiiiiiiii!", 
                icon: "success",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
        else {
            swal({
                title: "You lose!", 
                text: "get good :p", 
                icon: "error",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
    }
    else if (p1Move == 2 && p2Move == 1) {
        if (isP1) {
            swal({
                title: "You win!", 
                text: "yeeeeeeeeeaaaaaaah boiiiiiiiiiii!", 
                icon: "success",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
        else {
            swal({
                title: "You lose!", 
                text: "get good :p", 
                icon: "error",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
    }
    else if (p1Move == 2 && p2Move == 3) {
        if (!isP1) {
            swal({
                title: "You win!", 
                text: "yeeeeeeeeeaaaaaaah boiiiiiiiiiii!", 
                icon: "success",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
        else {
            swal({
                title: "You lose!", 
                text: "get good :p", 
                icon: "error",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
    }
    else if (p1Move == 3 && p2Move == 2) {
        if (isP1) {
            swal({
                title: "You win!", 
                text: "yeeeeeeeeeaaaaaaah boiiiiiiiiiii!", 
                icon: "success",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
        else {
            swal({
                title: "You lose!", 
                text: "get good :p", 
                icon: "error",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
    }
    else if (p1Move == 3 && p2Move == 1) {
        if (!isP1) {
            swal({
                title: "You win!", 
                text: "yeeeeeeeeeaaaaaaah boiiiiiiiiiii!", 
                icon: "success",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
        else {
            swal({
                title: "You lose!", 
                text: "get good :p", 
                icon: "error",
                buttons: {
                    retry: {
                        text: "Play again",
                        value: "retry"
                    },
                    back: {
                        text: "Exit game",
                        value: "exit"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "retry":
                        reset_game(isP1);
                        break;
                    case "exit":
                        location.reload();
                        break;
                    default:
                        reset_game(isP1);
                }
            });
        }
    }
    else {
        swal({
            title: "It's a Tie!", 
            text: "You've chosen the same!, booo!", 
            icon: "info",
            buttons: {
                retry: {
                    text: "Play again",
                    value: "retry"
                },
                back: {
                    text: "Exit game",
                    value: "exit"
                }
            }
        }).then((value) => {
            switch (value) {
                case "retry":
                    reset_game(isP1);
                    break;
                case "exit":
                    location.reload();
                    break;
                default:
                    reset_game(isP1);
            }
        });
    }
}

let reset_game = (isP1) => {
    let thisID = document.getElementById("gameIDTitle").innerText;
    command_handler_(0, 0);
    get_game_handler(thisID, isP1);
    command_handler_(0, 1);
    get_game_handler(thisID, isP1);
    document.getElementById("p1Command").src = 'thinking.png';
    document.getElementById("p2Command").src = 'thinking.png';
    if (isP1 == 1) {
        document.getElementById("p1Rock-b").disabled = false;
        document.getElementById("p1Paper-b").disabled = false;
        document.getElementById("p1Scissors-b").disabled = false;
    }
    else if (isP1 == 0) {
        document.getElementById("p2Rock-b").disabled = false;
        document.getElementById("p2Paper-b").disabled = false;
        document.getElementById("p2Scissors-b").disabled = false;
    }
    
}

let command_handler_ = (command, isP1) => {
    const gameID = document.getElementById("gameIDTitle").innerText;
    const username = document.getElementById("playerIDTitle").innerText;
    axios
        .put(`http://localhost:8080/command/${gameID},${isP1},${command},${username}`)
        .then(resp => {
            if (resp.data.includes("error")) {
                alert(`The command could not be applied. (${resp.data})`);
                return;
            } else if (resp.data.includes("success")) {
                
                return;
            }
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining the data.");
        });
}

let command_handler = (command, isP1) => {
    const gameID = document.getElementById("gameIDTitle").innerText;
    const username = document.getElementById("playerIDTitle").innerText;
    if (isP1 == 1) {
        document.getElementById("p1Rock-b").disabled = true;
        document.getElementById("p1Paper-b").disabled = true;
        document.getElementById("p1Scissors-b").disabled = true;
    }
    else if (isP1 == 0) {
        document.getElementById("p2Rock-b").disabled = true;
        document.getElementById("p2Paper-b").disabled = true;
        document.getElementById("p2Scissors-b").disabled = true;
    }
    axios
        .put(`http://localhost:8080/command/${gameID},${isP1},${command},${username}`)
        .then(resp => {
            if (resp.data.includes("error")) {
                alert(`The command could not be applied. (${resp.data})`);
                return;
            } else if (resp.data.includes("success")) {
                alert("Command applied succesfully!");
                get_game_handler(gameID, isP1);
                return;
            }
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining the data.");
        });
}

// DOMContentLoaded wait until all dom is loaded, check the docs in below link
// https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", (_) => {
    
    // The buttons' behavior.
    document.querySelector('#create-card').addEventListener('click', (event) => { create_game_handler() });
    document.querySelector('#join-card').addEventListener('click', (event) => { join_game_handler() });
    document.querySelector('#p1Rock-b').addEventListener('click', (event) => { command_handler(1, 1) });
    document.querySelector('#p1Paper-b').addEventListener('click', (event) => { command_handler(2, 1) });
    document.querySelector('#p1Scissors-b').addEventListener('click', (event) => { command_handler(3, 1) });
    document.querySelector('#p2Rock-b').addEventListener('click', (event) => { command_handler(1, 0) });
    document.querySelector('#p2Paper-b').addEventListener('click', (event) => { command_handler(2, 0) });
    document.querySelector('#p2Scissors-b').addEventListener('click', (event) => { command_handler(3, 0) });

    // Make the enter key press the buttons when typing in the fields.
    document.querySelector("#card-name-create").addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            document.querySelector("#create-card").click();
        }
    });
    
    

    document.getElementById("card-name-create").focus();
    document.getElementById("card-name-create").select();

});