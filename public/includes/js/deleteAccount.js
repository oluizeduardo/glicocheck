let btnConfirmDeleteAccount = document.getElementById("btnConfirmDeleteAccount");
let field_delete_account_Password = document.getElementById("field_delete_account_Password");

btnConfirmDeleteAccount.addEventListener('click', function(event){
    // In the future check user's password.
    if(field_delete_account_Password.value){
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => 
        {
            if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE && xmlhttp.status == OK) 
            {
                deleteUserAccount();
            }
        };
        sendRequestToDeleteGlucoseReadings(xmlhttp);
    }else{
        alert('Please, type the correct password to delete this account.');
    }
});

function sendRequestToDeleteGlucoseReadings(xmlhttp){
    const token = getJwtToken();
    const userId = getUserId();

    xmlhttp.open("DELETE", `/api/glucose/user/${userId}`);
    xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
}

function deleteUserAccount(){
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => 
    {
        if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE && xmlhttp.status == OK) 
        {
            location.href = './index.html'
            alert('The account has been deleted!');
        }
    };
    sendRequestToDeleteAccount(xmlhttp);
}

function sendRequestToDeleteAccount(xmlhttp){
    const token = getJwtToken();
    const userId = getUserId();

    xmlhttp.open("DELETE", `/api/users/${userId}`);
    xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
}