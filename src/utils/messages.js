/**
 * Messages used in the system.
 */
class Messages {
  static NOTHING_FOUND = 'Nothing found';
  static TOKEN_REQUIRED = 'Access token required';
  static TOKEN_EXPIRED = 'Token expired';
  static REFUSED_ACCESS = 'Refused access';
  static ROLE_ADMIN_REQUIRED = 'Role ADMIN is required';
  static REGISTER_DELETED = 'The register has been deleted';
  static WRONG_CREDENTIALS = 'Wrong credentials';

  static ERROR_CREATE_ACCOUNT = 'Error trying to create new account.'+
                                'Please try again.';

  static NEW_USER_CREATED = 'New user created.';
  static USER_DELETED = 'User deleted.';
  static ERROR_DELETE_USER = 'Error trying to delete user.';
  static ERROR_CREATE_USER = 'Error trying to insert a new user.';
  static ERROR_UPDATING_USER = 'Error updating user.';
  static ERROR_CHECKING_USER_ROLE = 'Error checking user role.';
  static EMAIL_ALREADY_USED = 'The email address is already used.';

  static ERROR_UPDATE_GLUCOSE = 'Error trying to update glucose reading.';
  static ERROR_DELETE_GLUCOSE = 'Error trying to delete glucose reading.';

  static ERROR_CREATE_MARKERMEAL = 'Error trying to create marker meal.';
  static ERROR_DELETE_MARKERMEAL = 'Error trying to delete marker meal.';
  static ERROR_UPDATE_MARKERMEAL = 'Error trying to update marker meal.';

  static ERROR_CHECKING_CREDENTIALS = 'Error checking credentials.';

  static RESET_PASSWORD_MESSAGE_SENT = 'Reset password message sent.';
  static ERROR_SEND_RESET_PASSWORD_MESSAGE = 'Error sending reset password message.';

  static RESET_TOKEN_DELETED = 'Token deleted.';
  static ERROR_DELETE_RESET_TOKEN = 'Error deleting reset token';
  static RESET_PASSWORD_PROCESS = 'Executing reset password process.';
  static PASSWORD_UPDATED = 'Password updated.';
}

module.exports = Messages;
