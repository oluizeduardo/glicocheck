let btnConfirmDeleteAccount = document.getElementById("btnConfirmDeleteAccount");
let field_delete_account_Password = document.getElementById("field_delete_account_Password");

btnConfirmDeleteAccount.addEventListener('click', () => {
    // In the future check user's password before deleting the account.
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
        swal("Password needed", 'Please, type the correct password to delete your account.', "warning");
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
            swal({
                title: "Success!",
                text: "Your account has been deleted.",
                icon: "success",
                closeOnClickOutside: false
            })
            .then(() => {
                logOut();
            });
        }
    };
    sendRequestToDeleteUserAccount(xmlhttp);
}

function sendRequestToDeleteUserAccount(xmlhttp){
    const token = getJwtToken();
    const userId = getUserId();

    xmlhttp.open("DELETE", `/api/users/${userId}`);
    xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
}