"use strict";
const url = "https://api.jotform.com/form/91762342937969/questions?apiKey=2c4ff6614e47de3c958b9ed4ff4f9e10";
let submitUrl = "https://api.jotform.com/form/91762342937969/submissions?apiKey=2c4ff6614e47de3c958b9ed4ff4f9e10"
let data;
let questions = [];
let answers = [];
let fields = [];
let resp;
let question;
let index;
let fieldIndex = 0;
let numberOfQuestions = 0;
let isName = 1;
let addressField = "streetAddress";
const apiKey= '97f0ba00';
fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
        let contents = data["content"];
        for(let key in contents){
            question = data["content"][key];
            if(question["type"] != "control_head" && question["type"] != "control_button"){
                questions.push({
                    id:   question["qid"],
                    type: question["type"]
                });
                numberOfQuestions++;
            }
        }
        for(index=0; index<numberOfQuestions; index++, fieldIndex++){
            let field = {
                name: "",
                type: ""
            };
            chooseField(field, questions[index].type);
            fields[fieldIndex] = field;
        }
        const mockUrl = 'https://api.mockaroo.com/api/generate.json?key=' + apiKey + '&fields=' + encodeURIComponent(JSON.stringify(fields));
        fetch(mockUrl)
            .then((resp) => resp.json())
            .then((data) => {
                fieldIndex = 0;
                for(index=0; index<numberOfQuestions; index++, fieldIndex++){
                    answers[fieldIndex] = data[fields[fieldIndex].name];
                    if(questions[index].type == "control_fullname"){
                        submitUrl += '&submission[' + questions[index].id + '][first]=' + answers[fieldIndex];
                        answers[fieldIndex+1] = data[fields[fieldIndex+1].name];
                        submitUrl += '&submission[' + questions[index].id + '][last]=' + answers[fieldIndex+1];
                        fieldIndex++;
                    }
                    else if(questions[index].type == "control_address"){
                        submitUrl += '&submission[' + questions[index].id + '][addr_line1]=' + answers[fieldIndex++];
                        answers[fieldIndex] = data[fields[fieldIndex].name];
                        submitUrl += '&submission[' + questions[index].id + '][addr_line2]=' + answers[fieldIndex++];
                        answers[fieldIndex] = data[fields[fieldIndex].name];
                        submitUrl += '&submission[' + questions[index].id + '][city]=' + answers[fieldIndex++];
                        answers[fieldIndex] = data[fields[fieldIndex].name];
                        submitUrl += '&submission[' + questions[index].id + '][state]=' + answers[fieldIndex++];
                        answers[fieldIndex] = data[fields[fieldIndex].name];
                        submitUrl += '&submission[' + questions[index].id + '][postal]=' + answers[fieldIndex++];
                        answers[fieldIndex] = data[fields[fieldIndex].name];
                        submitUrl += '&submission[' + questions[index].id + '][country]=' + answers[fieldIndex];
                    }
                    else if(questions[index].type == "control_datetime"){
                        const splitDate = answers[fieldIndex].split("/");
                        const month = splitDate[0];
                        const day = splitDate[1];
                        const year = splitDate[2];
                        submitUrl += '&submission[' + questions[index].id + '][month]=' + month;
                        submitUrl += '&submission[' + questions[index].id + '][day]=' + day;
                        submitUrl += '&submission[' + questions[index].id + '][year]=' + year;
                    }
                    else if(questions[index].type == "control_phone"){
                        const splitPhone = answers[fieldIndex].split(" ");
                        const areaCode = splitPhone[0];
                        const phoneNumber = splitPhone[1] + splitPhone[2];
                        submitUrl += '&submission[' + questions[index].id + '][area]=' + areaCode;
                        submitUrl += '&submission[' + questions[index].id + '][phone]=' + phoneNumber;
                    }
                    else {
                        submitUrl += '&submission[' + questions[index].id + ']=' + answers[fieldIndex];   
                    }
                }
                fetch(submitUrl, {
                    method: "POST"
                })
            }) 
    })
    .catch((error) => {
        console.log(error);
    })

const chooseField = (field, questionType) => {
    switch(questionType){
        case "control_fullname":
            if(isName){
                field.name = "firstname";
                field.type = "First Name";
                isName = 0;
                index--;
            }
            else {
                field.name = "lastname";
                field.type = "Last Name";
                isName = 1;
            }
            break;
        case "control_email":
            field.name = "email";
            field.type = "Email Address";
            break;
        case "control_address":
            switch(addressField){
                case "streetAddress":
                    field.name = "streetAddress";
                    field.type = "Street Address";
                    addressField = "streetAddressLine2";
                    index--;
                    break;
                case "streetAddressLine2":
                    field.name = "streetAddressLine2";
                    field.type = "Street Address";
                    addressField = "city";
                    index--;
                    break;
                case "city":
                    field.name = "city";
                    field.type = "City";
                    addressField = "state";
                    index--;
                    break;
                case "state":
                    field.name = "state";
                    field.type = "State";
                    addressField = "postal";
                    index--;
                    break;
                case "postal":
                    field.name = "postal";
                    field.type = "Postal Code";
                    addressField = "country";
                    index--;
                    break;
                case "country":
                    field.name = "country";
                    field.type = "Country";
                    addressField = "streetAddress";
                    break;
            }
            
            break;
        case "control_phone":
            field.name = "phoneNumber";
            field.type = "Phone";
            field.format = "### ### ####";
            break;
        case "control_datetime":
            field.name = "date";
            field.type = "Date";
            field.format = "%D";
            break;
        case "control_time":
            field.name = "time";
            field.type = "Time";
            break;
    }
}