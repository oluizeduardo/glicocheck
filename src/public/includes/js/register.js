const btnRegister = document.getElementById('btnRegister');
let field_name = document.getElementById("field_Name");
let field_email = document.getElementById("field_Email");
var field_password = document.getElementById("field_Password");
var confirm_password = document.getElementById("field_ConfirmPassword");

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
                    alert(Messages.ERROR_CREATE_ACCOUNT);
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
            field_password.value && isPasswordMatch());
}

function isPasswordMatch(){
    return (field_password.value === confirm_password.value);
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
        password: field_password.value,
        role_id: 1//ADMIN
    });
}

function handleLogin() {
    swal({
        title: "Success",
        text: "New user created! Now you can log in.",
        icon: "success"
    })
    .then(willRedirect => {
        if (willRedirect) {
            location.href = './index.html';
        }
    });
}

function redirectToDashboard(){
    location.href = './dashboard.html';
}

function showMessageAlert(){
    if(!isPasswordMatch()){
        swal("Passwords don't match", "Please, confirm the password.", "warning");
    }else{
        swal("Please, fill in all the fields", 'All the fields need to be filled.', "warning");
    }    
}