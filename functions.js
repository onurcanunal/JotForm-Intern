addItem = () => {
  const addingText = myText.value; 
  const itemKey = firebase.database().ref().child('todos').push().key;
  let updates = {};
  updates['/todos/' + itemKey] = {desc: addingText, status: 'waiting'};
  firebase.database().ref().update(updates);
  myText.value = "";
  myText.focus();
}
checkboxChanged = (box, item, list) => {
  return () => {
    let updates = {};
    if(box.checked == true){
      updates['/todos/' + item] = {desc:list[item].desc, status: 'done'};
    }
    else{
      updates['/todos/' + item] = {desc:list[item].desc, status: 'waiting'};
    }
    firebase.database().ref().update(updates);
  }
}
removeButtonClicked = (item) => {
  return () => {
    firebase.database().ref('/todos/' + item).remove();
    myText.focus();
  }
}
editButtonClicked = (item, edit, span, list) => {
  return () => {
    if(edit === 1){
      span.contentEditable = "true";
      edit = 0;
      span.focus();
    }
    else{
      let updates = {};
      updates['/todos/' + item] = {desc:span.innerHTML, status: list[item].status};
      firebase.database().ref().update(updates);
      span.contentEditable = "false";
      edit = 1;
      myText.focus();
    }
  }
}
updateCheckboxStatus = (item, itemList) => {
  if(itemList[item].status == 'waiting'){
    return false;
  }
  else{
    return true;
  }
}
byAlsoPressingEnter = (event) => {
  if(event.keyCode === 13) {
    document.getElementById("myButton").click();
  }
}
byEscapeNoEdit = (span, edit) => {
  return (event) => {
    if(event.keyCode === 27) {
      span.contentEditable = "false";
      edit = 1;
      myText.focus();
    }
  }
}