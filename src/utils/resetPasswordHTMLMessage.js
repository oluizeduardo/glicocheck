/* eslint-disable max-len */
/**
 * Class to create the message sent
 */
class ResetPasswordHTMLMessage {
  /**
   * Creates a HTML with reset password message,
   * this message will be sent to the user.
   * @param {string} resetToken The reset token to compose
   * the reset password link.
   * @return {string} HTML page.
   */
  static createHTMLMessage = (resetToken) => {
    const baseUrl = process.env.BASE_URL;
    const utlImage = 'https://raw.githubusercontent.com/oluizeduardo/my-diabetes-js/'+
                    'main/src/public/includes/imgs/glicocheck-logo-whitebg.png';
    return `
    <img src="${utlImage}" 
    alt="Glicocheck logo" width="220" height="120">
    <h3 style="font-weight: normal;">
      Dear user.
      <p>
        We received a request to reset the password on your Glicocheck account.
      </p>
      <p>
        Please, click the button bellow to change your password.
        <p>
        <a href="${baseUrl}/api/reset/${resetToken}">
        <button style="width:400px;padding:10px;background-color:#1877f2;
              color:white;border:none;border-radius:10px;">
              Change password
            </button>
          </a>
        </p>
      </p>
      <p style="padding:10px">
      <div style="font-weight: bold;">Didn't request this change?</div>
        If you didn't request a new password, <a href="${baseUrl}/api/reset/cancel/${resetToken}">let us know</a>.
      </p>
    </h3>
    <div style="margin-top:50px;">
      <p>
        Thanks for helping us keep your account secure.
        <br>
        The Glicocheck Team.
      </p>
    </div>`;
  };
}

module.exports = ResetPasswordHTMLMessage;
