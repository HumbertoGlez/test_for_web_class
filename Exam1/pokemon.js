/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
var stringToHTML = function (str) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, 'text/html');
  return doc.body;
};

let getCard = (name, id, weight, height, types, base_experience) => {
  return stringToHTML(`<li><div class="card" style="width: 18rem;">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${id}.png" class="card-img-top" alt="${name}">
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <ul class="card-items">
                  <li>ID: ${id}</li>
                  <li>Types: ${types}</li>
                  <li>Weight: ${weight}</li>
                  <li>Height: ${height}</li>
                  <li>Base Experience: ${base_experience}</li>
                </ul>
                <a href="https://www.pokemon.com/us/pokedex/${name}" class="btn btn-primary">Pokédex entry</a>
                <button class="remove-pokemon btn btn-primary">remove</button>
              </div>
          </div></li>`);
}

document.addEventListener("DOMContentLoaded", function(_){  //El "_" señala que es un argumento que no vamos a utilizar
  let event_handler = (_) =>{
      let pokemonName = document.getElementById("pokemon").value;
      if (pokemonName.trim() == '') return;
      axios
        .get(`http://localhost:8080/${pokemonName}`) 
        .then(resp => {
          console.log(resp.data); //Aquí está la data del pokemon
          console.log(`${data.species.name}` + " found.");
          let types = '';
          response.data.types.forEach((typeData) => {
            types += (typeData.type.name + ', ');
          })
          types = types.substring(0, length(types) - 2) + ".";
          let cardNode = getCard(resp.data.species.name, resp.data.id, resp.data.weight, resp.data.height, types, resp.data.base_experience)
          let pokemonList = document.getElementById("pokemonList");
          pokemonList.appendChild(cardNode);
          pokemonList.lastElementChild.querySelector(".remove-pokemon").addEventListener("click", (event) => 
            remove_item(event.target.parentNode.parentNode.parentNode)  
          );
        }).catch(function(error) {
            console.log(error);
            alert("No existe el puchamon que pusiste, ¿qué te pasa?");
        });
  }

    
}); 

let boton = document.getElementById("search"); 
boton.addEventListener("click", event_handler);


let remove_item  = (node_to_remove) => {
  // add the remove logic here 
  let pokemonList = document.getElementById("pokemons_list");
  let weightToSubstract = node_to_remove.querySelector('.weight').innerText;
  let total = Number(document.getElementById("total").innerText);
  console.log(total);
  total -= Number(weightToSubstract);
  document.getElementById("total").innerText = total;
  pokemonList.removeChild(node_to_remove);
}