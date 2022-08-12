const btnRegister = document.getElementById('btnRegister');
let field_name = document.getElementById("field_Name");
let field_email = document.getElementById("field_Email");
let field_login = document.getElementById("field_Login");
let field_password = document.getElementById("field_Password");

const SUCEESS = 201;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnRegister.addEventListener('click', function(event){
    event.preventDefault();

    if(isValidDataEntry()){
        const xmlhttp = new XMLHttpRequest();        
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) 
            {
                if(xmlhttp.status == SUCEESS)
                {                                      
                    handleLogin();
                
                }else {
                    alert('Error trying to create new account. Please try again.');
                }
            }
        };
        sendRequestToRegisterNewUser(xmlhttp);
    }else{
        showMessageAlert();
    }
});

function isValidDataEntry(){
    return (field_name.value && field_email.value && 
            field_login.value && field_password.value);
}

function sendRequestToRegisterNewUser(xmlhttp){
    let jsonNewUser = prepareJsonNewUser();
    xmlhttp.open("POST", "/api/security/register");
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send(jsonNewUser);
}

function prepareJsonNewUser(){
    return JSON.stringify({
        name: field_name.value,
        email: field_email.value,
        login: field_login.value,
        password: field_password.value,
        role_id: 1//ADMIN
    });
}

function handleLogin() {
    location.href = './index.html';
}

function redirectToDashboard(){
    location.href = './dashboard.html';
}

function showMessageAlert(){
    alert('Please, fill in all the fields.');
}