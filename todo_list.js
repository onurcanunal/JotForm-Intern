let myText = document.getElementById("myText");
myText.focus();
myText.onkeyup = byAlsoPressingEnter;
let myList = document.getElementById("myList");
firebase.database().ref('/todos/').on('value', (snapshot) => {
    while( myList.firstChild ){
      myList.removeChild(myList.firstChild);
    }
    let itemList = snapshot.val();
    Object.keys(itemList).forEach((item) => {
      let edit = 1;
      const node = document.createElement("LI");
      let myCheckBox = document.createElement("INPUT");
      myCheckBox.setAttribute("type", "checkbox");
      myCheckBox.checked = updateCheckboxStatus(item, itemList);
      node.appendChild(myCheckBox);
      const textnode = document.createTextNode(itemList[item].desc);
      let mySpan = document.createElement("SPAN");
      mySpan.appendChild(textnode);
      node.appendChild(mySpan);
      let removeButton = document.createElement("BUTTON");
      let buttonText = document.createTextNode("Remove");
      removeButton.appendChild(buttonText);
      removeButton.classList.add("removeButton");
      node.appendChild(removeButton);
      let editButton = document.createElement("BUTTON");
      buttonText = document.createTextNode("Edit");
      editButton.appendChild(buttonText);
      editButton.classList.add("editButton");
      node.appendChild(editButton);
      myCheckBox.onchange = checkboxChanged(myCheckBox, item, itemList);
      removeButton.onclick = removeButtonClicked(item);
      editButton.onclick = editButtonClicked(item, edit, mySpan, itemList);
      mySpan.onkeyup =  byEscapeNoEdit(mySpan, edit);
      myList.appendChild(node);
    });    
});