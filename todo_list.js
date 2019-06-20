let myText = document.getElementById("myText");
myText.focus();
let myList = document.getElementById("myList");
firebase.database().ref('/todos/').on('value', (snapshot) => {
    while( myList.firstChild ){
      myList.removeChild( myList.firstChild );
    }
    const itemList = snapshot.val();
    Object.keys(itemList).forEach((item) => {
      let edit = 1;
      const node = document.createElement("LI");
      let myCheckBox = document.createElement("INPUT");
      myCheckBox.setAttribute("type", "checkbox");
      if(itemList[item].status == 'waiting'){
        myCheckBox.checked = false;
      }
      else{
        myCheckBox.checked = true;
      }
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
      myCheckBox.onchange = () => {
        let updates = {};
        if(myCheckBox.checked == true){
          updates['/todos/' + item] = {desc:itemList[item].desc, status: 'done'};
        }
        else{
          updates['/todos/' + item] = {desc:itemList[item].desc, status: 'waiting'};
        }
        firebase.database().ref().update(updates);
      }
      removeButton.onclick = () => {
        firebase.database().ref('/todos/' + item).remove();
        myText.focus();
      }
      editButton.onclick = () => {
        if(edit === 1){
          mySpan.contentEditable = "true";
          edit = 0;
          mySpan.focus();
        }
        else{
          let updates = {};
          updates['/todos/' + item] = {desc:mySpan.innerHTML, status: itemList[item].status};
          firebase.database().ref().update(updates);
          mySpan.contentEditable = "false";
          edit = 1;
          myText.focus();
        }
      }
      myList.appendChild(node);
    });    
});

myFunction = () => {
  const addingText = myText.value; 
  const itemKey = firebase.database().ref().child('todos').push().key;
  let updates = {};
  updates['/todos/' + itemKey] = {desc: addingText, status: 'waiting'};
  firebase.database().ref().update(updates);
  myText.value = "";
}
myText.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    document.getElementById("myButton").click();
  }
});