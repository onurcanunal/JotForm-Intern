var myText = document.getElementById("myText");
myText.focus();
var myList = document.getElementById("myList");
firebase.database().ref('/todos/').on('value', function(snapshot) {
    while( myList.firstChild ){
      myList.removeChild( myList.firstChild );
    }
    var itemList = snapshot.val();
    Object.keys(itemList).forEach((item) => {
      var edit = 1;
      var node = document.createElement("LI");
      var myCheckBox = document.createElement("INPUT");
      myCheckBox.setAttribute("type", "checkbox");
      if(itemList[item].status == 'waiting'){
        myCheckBox.checked = false;
      }
      else{
        myCheckBox.checked = true;
      }
      node.appendChild(myCheckBox);
      var textnode = document.createTextNode(itemList[item].desc);
      var mySpan = document.createElement("SPAN");
      mySpan.appendChild(textnode);
      node.appendChild(mySpan);
      var removeButton = document.createElement("BUTTON");
      var buttonText = document.createTextNode("Remove");
      removeButton.appendChild(buttonText);
      removeButton.style.position = "absolute";
      removeButton.style.left = "700px";
      removeButton.style.paddingRight = "5px";
      removeButton.style.backgroundColor = "white";
      removeButton.style.borderColor = "red";
      removeButton.style.width = "65px";
      removeButton.onmouseover = function(){
        removeButton.style.backgroundColor = "red";
      };
      removeButton.onmouseout = function(){
        removeButton.style.backgroundColor = "white";
      };
      node.appendChild(removeButton);
      var editButton = document.createElement("BUTTON");
      buttonText = document.createTextNode("Edit");
      editButton.appendChild(buttonText);
      editButton.style.position = "absolute";
      editButton.style.left = "770px";
      editButton.style.backgroundColor = "white";
      editButton.style.borderColor = "blue";
      editButton.style.width = "65px";
      editButton.onmouseover = function(){
        editButton.style.backgroundColor = "blue";
      };
      editButton.onmouseout = function(){
        editButton.style.backgroundColor = "white";
      };
      node.appendChild(editButton);
      myCheckBox.onchange = function(){
        var updates = {};
        if(myCheckBox.checked == true){
          updates['/todos/' + item] = {desc:itemList[item].desc, status: 'done'};
        }
        else{
          updates['/todos/' + item] = {desc:itemList[item].desc, status: 'waiting'};
        }
        firebase.database().ref().update(updates);
      };
      removeButton.onclick = function(){
        firebase.database().ref('/todos/' + item).remove();
        myText.focus();
      };
      editButton.onclick = function(){
        if(edit === 1){
          mySpan.contentEditable = "true";
          edit = 0;
          mySpan.focus();
        }
        else{
          var updates = {};
          updates['/todos/' + item] = {desc:mySpan.innerHTML, status: itemList[item].status};
          firebase.database().ref().update(updates);
          mySpan.contentEditable = "false";
          edit = 1;
          myText.focus();
        }
      };
      myList.appendChild(node);
    });    
});


function myFunction() {
  var addingText = document.getElementById("myText").value; 
  var itemKey = firebase.database().ref().child('todos').push().key;
  var updates = {};
  updates['/todos/' + itemKey] = {desc: addingText, status: 'waiting'};
  firebase.database().ref().update(updates);
  document.getElementById("myText").value = "";
}

var input = document.getElementById("myText");
  input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   document.getElementById("myButton").click();
  }
});