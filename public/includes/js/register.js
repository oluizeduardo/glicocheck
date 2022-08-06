const btnRegister = document.getElementById('btnRegister');
const btnClean = document.getElementById('btnClean');

const field_name = document.querySelector("#name");
const field_email = document.querySelector("#email");
const field_login = document.querySelector("#login");
const field_password = document.querySelector("#password");
const field_role = document.querySelector("#role");
const field_response = document.getElementById('response_field');

btnRegister.addEventListener('click', function(event){
    if(isValidDataEntry()){
        const xmlhttp = new XMLHttpRequest();
        // SHOW RESPONSE WHEN EVERYHTING IS READY.
        xmlhttp.onreadystatechange = () => {
            if (isSuccessOrRefused(xmlhttp)) {
                cleanFields();
                const prettyJson = getPrettyJSON(xmlhttp.responseText);
                field_response.value = prettyJson;
            }
        };
        let jsonNewUser = prepareJsonNewUser();
        xmlhttp.open("POST", "/api/security/register");
        xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xmlhttp.send(jsonNewUser);
    }
});

btnClean.addEventListener('click', function(event){
    cleanFields();
});

function isValidDataEntry(){
    return (field_name.value && field_email.value && 
            field_login.value && field_password.value && field_role.value);
}

function isSuccessOrRefused(xmlhttp){
    return xmlhttp.readyState == 4 && (xmlhttp.status == 201 || xmlhttp.status == 403);
}

function getPrettyJSON(text){
    if(!text) text = "{}";
    const jsonResponse = JSON.parse(text);
    return JSON.stringify(jsonResponse, null, '\t');
}

function prepareJsonNewUser(){
    return JSON.stringify({
        name: field_name.value,
        email: field_email.value,
        login: field_login.value,
        password: field_password.value,
        role_id: field_role.value
    });
}

function cleanFields(){
    field_name.value = "";
    field_email.value = "";
    field_login.value = "";
    field_password.value = "";
    field_role.value = "2";
    field_response.value = "";
}