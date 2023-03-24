/**
 * Class to create the message sent 
 */
class ResetPasswordHTMLMessage {
  static createHTMLMessage = (resetToken) => {
    return `    
    <img src="https://raw.githubusercontent.com/oluizeduardo/my-diabetes-js/main/src/public/includes/imgs/glicocheck-logo-whitebg.png" 
    alt="Glicocheck logo" width="280" height="150">
    
    <h2>Hi!</h2>
    <p>
      We received a request to reset the password on your Glicocheck account.
    </p>
    <p>
      Please, click <a href="http://localhost:4500/reset/${resetToken}">here</a> to reset your password.
    </p>
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
