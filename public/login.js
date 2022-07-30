let btnLogin = document.getElementById('btnLogin');
let btnClean = document.getElementById('btnClean');
var field_login = document.querySelector("#user_login");
var field_password = document.querySelector("#password");
let field_token = document.getElementById('token');
let field_response = document.getElementById('response_field');

btnLogin.addEventListener('click', function(event){        
    
    if(isValidDataEntry()){
        const xmlhttp = new XMLHttpRequest();
        // SHOW RESPONSE WHEN EVERYHTING IS READY.
        xmlhttp.onreadystatechange = () => {
            if (isSuccessOrRefusedAccess(xmlhttp)) {
                const token = getAuthorizationHeaderValue(xmlhttp);
                const prettyJson = getPrettyJSON(xmlhttp.responseText);

                field_token.innerText = token;
                field_response.value = prettyJson;
            }
        };
        // REQUEST TO LOGIN.
        let jsonLogin = prepareJsonLogin();
        xmlhttp.open("POST", "/api/security/login");
        xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xmlhttp.send(jsonLogin);
    }
});

btnClean.addEventListener('click', function(event){
    field_login.value = "";
    field_password.value = "";
    field_token.innerText = "";
    field_response.value = "";
});

function isValidDataEntry(){
    return (field_login.value && field_password);
}

function isSuccessOrRefusedAccess(xmlhttp){
    return xmlhttp.readyState == 4 && (xmlhttp.status == 201 || xmlhttp.status == 403);
}

function prepareJsonLogin(){
    return JSON.stringify({
        login: field_login.value,
        password: field_password.value
    });
}

function getAuthorizationHeaderValue(xmlhttp){
    return xmlhttp.getResponseHeader('authorization');
}

function getPrettyJSON(text){
    if(!text) text = "{}";
    const jsonResponse = JSON.parse(text);
    return JSON.stringify(jsonResponse, null, '\t');
}