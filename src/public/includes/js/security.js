/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/**
 * Check whether a password is used by a specific user.
 * @param {string} pass The user password.
 * @param {Function} callback The callback function
 * to be executed when the password checking is done.
 */
function checkUserPassword(pass, callback) {
  const cod_user = getUserId();
  const password = pass;

  const json = JSON.stringify({
    cod_user,
    password,
  });

  const xhr = new XMLHttpRequest();
  xhr.open('POST', API_BASE_REQUEST+'/authentication/validate-password');
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
  xhr.onload = () => {
    const passwordValidationResult = JSON.parse(xhr.response).is_valid;
    callback(passwordValidationResult);
  };
}
