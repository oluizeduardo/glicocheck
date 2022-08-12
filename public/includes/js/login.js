let btnSingIn = document.getElementById("btnSingIn");
var field_login = document.getElementById("field_Login");
var field_password = document.getElementById("field_Password");

const SUCEESS = 201;
const FORBIDDEN = 403;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnSingIn.addEventListener('click', function(event){
    event.preventDefault();

    if(isValidDataEntry())
    {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => 
        {
            if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) 
            {
                if(xmlhttp.status == SUCEESS)
                {                    
                    generateAccessTokenAndRedirect(xmlhttp);                    
                
                }else if(xmlhttp.status == FORBIDDEN){
                    alert('Wrong credentials.');
                }
            }
        };
        sendRequestToLogin(xmlhttp);
    }else{
        showLoginError();
    }
});

function isValidDataEntry(){
    return (field_login.value && field_password.value);
}

function sendRequestToLogin(xmlhttp){
    let jsonLogin = prepareJsonLogin();
    xmlhttp.open("POST", "/api/security/login");
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send(jsonLogin);
}

function prepareJsonLogin(){
    return JSON.stringify({
        login: field_login.value,
        password: field_password.value
    });
}

function redirectToDashboard(){
    location.href = './dashboard.html';
}

function getAuthorizationHeaderValue(xmlhttp){
    return xmlhttp.getResponseHeader('authorization');
}

function setJwtToken(token) {
    sessionStorage.setItem("jwt", token)
}

function generateAccessTokenAndRedirect(xmlhttp){
    const token = getAuthorizationHeaderValue(xmlhttp);    
    setJwtToken(token);
    setUserId(xmlhttp);                
    redirectToDashboard();
}

function setUserId(xmlhttp){
    JSON.parse(xmlhttp.response, 
        (k, v) => {
            if(k === "id"){
                sessionStorage.setItem("userId", v);
            }
        });
}

function showLoginError(){
    field_login.style = "border:1px solid red;"
    field_password.style = "border:1px solid red;"
    alert('Please, inform correct login and password.');
}