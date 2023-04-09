/**
 * Check whether a password is used by a specific user.
 * @param {string} pass The user password.
 * @param {Function} callback The callback function
 * to be executed when the password checking is done.
 */
function checkUserPassword(pass, callback) {
  const userId = getUserId();
  const password = pass;

  const json = JSON.stringify({
    userId: userId,
    password: password,
  });

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/security/password/validation');
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
  xhr.onload = () => {
    const passwordValidationResult = JSON.parse(xhr.response).result;
    callback(passwordValidationResult);
  };
}
