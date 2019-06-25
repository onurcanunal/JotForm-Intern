"use strict";
const url = "https://api.jotform.com/form/91742621200950/questions?apiKey=2c4ff6614e47de3c958b9ed4ff4f9e10";
let submitUrl = "https://api.jotform.com/form/91742621200950/submissions?apiKey=2c4ff6614e47de3c958b9ed4ff4f9e10"
let data;
let questions = [];
let answers = [];
let fields = [];
let resp;
let question;
let index;
let numberOfQuestions = 0;
let subUrl;
const apiKey= '97f0ba00';
fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
        const numberOfContents = Object.keys(data["content"]).length;
        for(index=0; index<numberOfContents; index++){
            question = data["content"][index+1];
            if(question["type"] != "control_head" && question["type"] != "control_button"){
                questions.push({
                    id:   question["qid"],
                    type: question["type"]
                });
                numberOfQuestions++;
            } 
        }
        for(index=0; index<numberOfQuestions; index++){
            let field = {
                name: "",
                type: ""
            };
            chooseField(field, questions[index].type);
            fields[index] = field;
        }
        const mockUrl = 'https://api.mockaroo.com/api/generate.json?key=' + apiKey + '&fields=' + encodeURIComponent(JSON.stringify(fields));
        fetch(mockUrl)
            .then((resp) => resp.json())
            .then((data) => {
                for(index=0; index<numberOfQuestions; index++){
                    answers[index] = data[fields[index].name];
                    submitUrl += '&submission[' + questions[index].id + ']=' + encodeURIComponent(JSON.stringify(answers[index]));   
                }
                fetch(submitUrl, {
                    method: "POST"
                })
                    .then((resp) => resp.json())
                    .then((data) => {
                        
                    })
            }) 
    })
    .catch((error) => {
        console.log(error);
    })

const chooseField = (field, questionType) => {
    switch(questionType){
        case "control_fullname":
            field.name = "fullname";
            field.type = "Full Name";
            break;
        case "control_email":
            field.name = "email";
            field.type = "Email Address";
            break;
        case "control_address":
            field.name = "address";
            field.type = "Street Address";
            break;
        case "control_phone":
            field.name = "phoneNumber";
            field.type = "Phone";
            break;
        case "control_datetime":
            field.name = "date";
            field.type = "Date";
            break;
        case "control_time":
            field.name = "time";
            field.type = "Time";
            break;
    }
}