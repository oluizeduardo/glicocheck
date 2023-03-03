var field_Name = document.getElementById("field_Name");
let field_Email = document.getElementById("field_Email");
let field_Password = document.getElementById("field_Password");
let field_confirm_Password = document.getElementById("field_confirm_Password");
let btnSave = document.getElementById("btnSave");

const OK = 200;
const SUCCESS = 201;
const XMLHTTPREQUEST_STATUS_DONE = 4;

function loadUserInfos(){
    const xmlhttp = new XMLHttpRequest();        
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) 
        {
          if(xmlhttp.status == OK)
          {
            const data = JSON.parse(xmlhttp.responseText);
            field_Name.value = data.user.name;
            field_Email.value = data.user.email;
          }
        }
    };
    sendGETToUserById(xmlhttp);
  }

function sendGETToUserById(xmlhttp){
    const token = getJwtToken();
    const userId = getUserId();

    if(token && userId){
        xmlhttp.open("GET", `/api/users/${userId}`);
        xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
        xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xmlhttp.send();
    }else{
        throw Error('Authentication token not found.');
    }
}
  
function getJwtToken() {
    return sessionStorage.getItem("jwt")
}
function getUserId() {
return sessionStorage.getItem("userId")
}

btnSave.addEventListener('click', (event) => {
    event.preventDefault();

    if(isValidDataEntry())
    {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => 
        {
            if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) 
            {
                if(xmlhttp.status == SUCCESS)
                {
                    swal("Saved!", '', "success");
                    field_Password.value = '';
                    field_confirm_Password.value = '';
                                    
                }else{
                    swal("Error", 'Error trying to update user infos.', "error");
                }
            }
        };
        sendRequestToUserDetails(xmlhttp);
    }else{
        showAlertMessage();
    }
});

function isValidDataEntry(){
    return (field_Name.value && field_Email.value && 
            field_Password.value && field_confirm_Password.value);
}

function sendRequestToUserDetails(xmlhttp){
    const token = getJwtToken();
    const userId = getUserId();

    let jsonLogin = prepareJsonUser();
    xmlhttp.open("PUT", `/api/users/${userId}`);
    xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send(jsonLogin);
}

function prepareJsonUser(){
    return JSON.stringify({
        name: field_Name.value,
        email: field_Email.value,
        password: field_Password.value,
        role_id: 1
    });
}

function showAlertMessage(){
    swal("", 'All the fields need to be filled.', "warning");
}

loadUserInfos();