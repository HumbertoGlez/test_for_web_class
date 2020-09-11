function get_element_li (name, price) {
  let newLi = document.createElement("li");
  newLi.classList.add("added-item");
  if (isNaN(price)) {
    newLi.classList.add("invalid-input");
  }
  newLi.appendChild(document.createTextNode('name: ' + name + '\tprice: '));
  let priceSpan = document.createElement("span");
  priceSpan.appendChild(document.createTextNode(price));
  priceSpan.classList.add("price-value");
  newLi.appendChild(priceSpan);
  let rmvButton = document.createElement("button");
  rmvButton.classList.add("remove-item");
  rmvButton.appendChild(document.createTextNode('remove'));
  newLi.appendChild(rmvButton);
  return newLi;
}

let add_item_to_list_with_template = (template_function) => {
  return (event) => {
    /*
      add the item to the list
      add event listener to the button inside the element just added with the remove_item function
      add the value to the total
    */
    let itemName = document.querySelector("#item-name").value;
    let itemPrice = document.querySelector('#item-value').value;
    if (itemName.trim() == '' || itemPrice.trim() == '') return;
    let template = template_function(itemName, itemPrice);
    let itemList = document.getElementById("items");
    itemList.appendChild(template);
    itemList.lastElementChild.querySelector(".remove-item").addEventListener("click", (event) => 
      remove_item(event.target.parentNode)  
    );
    if (!isNaN(itemPrice)) {
      let total = Number(document.getElementById("total").innerText);
      console.log(total);
      total += Number(itemPrice);
      document.getElementById("total").innerText = total;
    }
  }
}
let addHandler = add_item_to_list_with_template(get_element_li);

/*
 for removing elements could be this way
  let element_to_delete = document.querySelector("selector").lastElementChild;
  element_to_delete.parentNode.removeChild(element_to_delete);
  or we could use ChildNode.remove()
  https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
*/

let remove_item  = (node_to_remove) => {
    let itemList = document.getElementById("items");
    let priceToSubstract = node_to_remove.querySelector('.price-value').innerText;
    if (!isNaN(priceToSubstract)) {
      let total = Number(document.getElementById("total").innerText);
      console.log(total);
      total -= Number(priceToSubstract);
      document.getElementById("total").innerText = total;
    }
    itemList.removeChild(node_to_remove);
}