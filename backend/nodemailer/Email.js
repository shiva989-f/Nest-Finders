import { RESET_PASSWORD_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_TEMPLATE } from "./EmailTemplate.js";
import { transporter } from "./NodemailerConfig.js";

export const sendVerificationEmail = async (email, otp) => {
  // All mail data
  const mailOptions = {
    from: '"GrihaKalp" <foradsonly98@gmail.com>',
    to: email,
    subject: "Verify your email",
    // text: "This is a test email using Nodemailer!", // use text if want to send only text
    html: VERIFICATION_EMAIL_TEMPLATE.replace("123456", otp),
    category: "Email Verification",
  };

  try {
    // transporter is mail configuration imported from nodemailer.config.js
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification mail:", error.message);
        return; // Prevents further execution
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendWelcomeEmail = async (email, username) => {
  // All mail data
  const mailOptions = {
    from: '"GrihaKalp" <foradsonly98@gmail.com>',
    to: email,
    subject: "Welcome to GrihaKalp",
    // text: "This is a test email using Nodemailer!", // use text if want to send only text
    html: WELCOME_TEMPLATE.replace("UserName", username),
    category: "Welcome E-Mail",
  };

  try {
    // transporter is mail configuration imported from nodemailer.config.js
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending welcome mail:", error.message);
        return; // Prevents further execution
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendResetPasswordEmail = async (email, resetLink) => {
  // All mail data
  const mailOptions = {
    from: '"GrihaKalp" <foradsonly98@gmail.com>',
    to: email,
    subject: "Reset Your Password",
    // text: "This is a test email using Nodemailer!", // use text if want to send only text
    html: RESET_PASSWORD_TEMPLATE.replace("resetURL", resetLink),
    category: "Reset Password",
  };

  try {
    // transporter is mail configuration imported from nodemailer.config.js
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending reset password link to your mail:", error.message);
        return; // Prevents further execution
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
