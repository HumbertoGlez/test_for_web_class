/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
var stringToHTML = function (str) {
  var template = document.createElement('template');
  html = str.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = str;
  return template.content.firstChild;
};

let getCard = (name, id, weight, height, types, base_experience) => {
  return stringToHTML(`<div class="col mb-4"><div class="card h-100" style="width: 18rem;">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${id}.png" class="card-img-top" alt="${name}">
              <div class="card-body">
                <h4 class="card-title">${name}</h5>
                <ul class="card-items">
                  <li>ID: ${id}</li>
                  <li>Types: ${types}</li>
                  <li>Weight: ${weight}kg</li>
                  <li>Height: ${height}m</li>
                  <li>Base Experience: ${base_experience}</li>
                </ul>
                <a href="https://www.pokemon.com/us/pokedex/${name}" target="_blank" class="btn btn-danger">Pokédex Entry</a>
                <button class="remove-pokemon btn btn-dark">Remove</button>
              </div>
          </div></div>`);
}

document.addEventListener("DOMContentLoaded", function(_){  //El "_" señala que es un argumento que no vamos a utilizar
  let event_handler = (_) =>{
      let pokemonName = document.getElementById("pokemon").value;
      if (pokemonName.trim() == '') return;
      axios
        .get(`http://localhost:8080/${pokemonName}`) 
        .then(resp => {
          console.log(resp.data); //Aquí está la data del pokemon
          console.log(`${resp.data.species.name}` + " found.");
          let types = '';
          resp.data.types.forEach((typeData) => {
            types += (typeData.type.name + ', ');
          })
          types = types.substring(0, types.length - 2) + ".";
          let weightKg = Number(resp.data.weight) / 10;
          let heightMeters = Number(resp.data.height) / 10;
          let nameWithMayus = resp.data.name[0].charAt(0).toUpperCase() + resp.data.name.slice(1);
          let cardNode = getCard(nameWithMayus, resp.data.id, weightKg, heightMeters, types, resp.data.base_experience)
          let pokemonList = document.getElementById("pokemonList");
          pokemonList.appendChild(cardNode);
          pokemonList.lastElementChild.querySelector(".remove-pokemon").addEventListener("click", (event) => 
            remove_item(event.target.parentNode.parentNode.parentNode)  
          );
        }).catch(function(error) {
            console.log(error);
            swal("Oh oh...", "No existe ese puchamon, ¿Qué te pasa?", "error");
        });
  }

  
  let boton = document.getElementById("search"); 
  boton.addEventListener("click", event_handler);
    
}); 


let remove_item  = (node_to_remove) => {
  // add the remove logic here 
  let pokemonList = document.getElementById("pokemonList");
  pokemonList.removeChild(node_to_remove);
}