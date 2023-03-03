let btnSingIn = document.getElementById("btnSingIn");
var field_email = document.getElementById("field_Email");
var field_password = document.getElementById("field_Password");

const SUCEESS = 201;
const FORBIDDEN = 403;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnSingIn.addEventListener('click', (event) => {
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
                    const message  = `Please try again by entering the same email 
                                      and password used during account creation.`
                    swal("Wrong credentials", message, "error");
                }
            }
        };
        sendRequestToLogin(xmlhttp);
    }else{
        showLoginError();
    }
});

function isValidDataEntry(){
    return (field_email.value && field_password.value);
}

function sendRequestToLogin(xmlhttp){
    let jsonLogin = prepareJsonLogin();
    xmlhttp.open("POST", "/api/security/login");
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send(jsonLogin);
}

function prepareJsonLogin(){
    return JSON.stringify({
        email: field_email.value,
        password: field_password.value
    });
}

function generateAccessTokenAndRedirect(xmlhttp){
    const token = getAuthorizationHeaderValue(xmlhttp);    
    setJwtToken(token);
    setUserId(xmlhttp);                
    redirectToDashboard();
}

function getAuthorizationHeaderValue(xmlhttp){
    return xmlhttp.getResponseHeader('authorization');
}

function setJwtToken(token) {
    sessionStorage.setItem("jwt", token)
}

function setUserId(xmlhttp){
    JSON.parse(xmlhttp.response, 
        (k, v) => {
            if(k === "user_id"){
                sessionStorage.setItem("userId", v);
            }
        });
}

function redirectToDashboard(){
    location.href = './dashboard.html';
}

function showLoginError(){
    swal("Wrong credentials", "Please, inform the correct email and password.", "warning");
}