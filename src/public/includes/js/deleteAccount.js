const btnConfirmDeleteAccount = document.getElementById('btnConfirmDeleteAccount');
const fieldDeleteAccountPassword = document.getElementById('field_delete_account_Password');

btnConfirmDeleteAccount.addEventListener('click', () => {
  checkUserPassword((isCorrectPassword) => {
    if (isCorrectPassword) {
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE &&
          xmlhttp.status == OK) {
          deleteUserAccount();
        }
      };
      sendRequestToDeleteGlucoseReadings(xmlhttp);
    } else {
      const text = 'Please, type the correct password to delete your account.';
      swal('Password needed', text, 'warning');
    }
  });
});

function sendRequestToDeleteGlucoseReadings(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  xmlhttp.open('DELETE', `/api/glucose/user/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send();
}

function deleteUserAccount() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE &&
      xmlhttp.status == OK) {
      swal({
        title: 'Success!',
        text: 'Your account has been deleted.',
        icon: 'success',
        closeOnClickOutside: false,
      })
          .then(() => {
            logOut();
          });
    }
  };
  sendRequestToDeleteUserAccount(xmlhttp);
}

function sendRequestToDeleteUserAccount(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  xmlhttp.open('DELETE', `/api/users/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send();
}

function checkUserPassword(onLoad) {
  const userId = getUserId();
  const password = fieldDeleteAccountPassword.value;

  const json = JSON.stringify({
    'userId': userId,
    'password': password,
  });

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/security/password/validation');
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
  xhr.onload = () => {
    onLoad(JSON.parse(xhr.response).result);
  };
}
