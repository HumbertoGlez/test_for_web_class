const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = 8080
let pokemons = {}

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cors())

app.get('/:pokemonName', (req, res) => {

  let pokemon_name = req.params["pokemonName"]
  if (pokemons[pokemon_name]){    
    console.log("Ya esta el pokemon")
    res.send(pokemons[pokemon_name])
  }
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`) 
    .then(pokemon_response => {
      pokemons[pokemon_name] = pokemon_response.data;
      console.log(pokemons[pokemon_name].name);
      res.send(pokemon_response.data);
    }).catch(function(error) {
        console.log(error);
        res.status(404).send({message: 'Puchamon not found.'});
    });
  console.log("when the axios get call is in progress")
})


app.listen(port)