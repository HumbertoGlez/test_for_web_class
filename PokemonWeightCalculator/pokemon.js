// FALTAN IMAGENES DE PUCHAMONES

let get_element_li  = (pokemon, weight, sprite) => {
  let newLi = document.createElement("li");
  newLi.classList.add("added-pokemon");
  newLi.appendChild(document.createTextNode('Name: ' + pokemon));

  let spriteDiv = document.createElement("div");
  let pkmnImg = document.createElement("IMG");
  pkmnImg.setAttribute("src", sprite);
  pkmnImg.setAttribute("width", "100px");
  pkmnImg.classList.add("pokemon-img");
  spriteDiv.appendChild(pkmnImg);

  let weightDiv = document.createElement("div");
  weightDiv.appendChild(document.createTextNode('Weight: '));
  weightDiv.classList.add("weight-div");

  let weightSpan = document.createElement('span');
  weightSpan.appendChild(document.createTextNode(weight));
  weightSpan.classList.add("weight");
  weightDiv.appendChild(weightSpan);
  weightDiv.appendChild(document.createTextNode(' Kg.'));

  newLi.appendChild(spriteDiv);
  newLi.appendChild(weightDiv);

  let rmvButton = document.createElement("button");
  rmvButton.classList.add("remove-pokemon");
  rmvButton.appendChild(document.createTextNode('remove'));
  newLi.appendChild(rmvButton);
  return newLi;
}

let add_item_to_list_with_template = (template_function) => {
  return (event) => {
    let pokemonName = document.querySelector("#pokemon").value;
    if (pokemonName.trim() == '') return;

    let template = template_function(pokemonName);
    let itemList = document.getElementById("pokemons_list");
    itemList.appendChild(template);
    itemList.lastElementChild.querySelector(".remove-item").addEventListener("click", (event) => 
      remove_item(event.target.parentNode)  
    );
  }
}

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


document.addEventListener("DOMContentLoaded", function(_){  //El "_" señala que es un argumento que no vamos a utilizar
let event_handler = (_) =>{
    let pokemonName = document.getElementById("pokemon").value;
    if (pokemonName.trim() == '') return;
    $.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, function(data, status) {
      console.log(`${data.species.name}`);
      console.log(`${data.weight}`);

      let pkmnWeightKg = Number(data.weight)/10;
      let pkmnSprite = data.sprites.other['official-artwork'].front_default;
      if (pkmnSprite == null) {
        pkmnSprite = data.sprites.front_default;
      }
      let node = get_element_li(data.species.name, pkmnWeightKg, pkmnSprite);
      let itemList = document.getElementById("pokemons_list");
      itemList.appendChild(node);

      let total = Number(document.getElementById("total").innerText);
      console.log(total);
      total += pkmnWeightKg;
      document.getElementById("total").innerText = total;

      itemList.lastElementChild.querySelector(".remove-pokemon").addEventListener("click", (event) => 
        remove_item(event.target.parentNode)  
      );
    }).fail(function() {
        alert("No existe el puchamon");
    });
}


let boton = document.getElementById("search"); 
boton.addEventListener("click", event_handler);

  
}); 

