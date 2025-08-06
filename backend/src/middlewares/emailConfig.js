import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); 

export const sendOtpEmail = async (email, VerificationCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DevFund" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your DevFund Verification Code',
      html: `
        <div style="background-color: #121212; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e1e1e; border-radius: 12px; padding: 30px; border: 1px solid #333;">
            
            <h1 style="font-size: 28px; color: #5865F2; margin-bottom: 10px;">DevFund</h1>
            <h2 style="font-size: 24px; margin-bottom: 20px; color: #f0f0f0;">One More Step to Go!</h2>
            
            <p style="font-size: 16px; color: #b0b0b0; line-height: 1.6;">
              Thanks for joining us! Please use the following secure code to verify your email address and complete your registration.
            </p>
            
            <div style="background-color: #2a2a2a; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <p style="font-size: 16px; color: #b0b0b0; margin: 0 0 10px 0;">Your verification code is:</p>
              <p style="font-size: 42px; font-weight: bold; color: #ffffff; letter-spacing: 8px; margin: 0;">${VerificationCode}</p>
            </div>
            
            <p style="font-size: 14px; color: #808080;">
              This code is valid for the next 10 minutes. If you didn't request this, you can safely ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />

            <footer style="font-size: 12px; color: #808080;">
              <p>&copy; ${new Date().getFullYear()} DevFund. All rights reserved.</p>
              <p>Crafted with ❤️ for developers.</p>
            </footer>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent to", email);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};
export const sendwelcomeemail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DevFund" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to DevFund!',
      html: `
        <div style="background-color: #121212; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e1e1e; border-radius: 12px; padding: 30px; border: 1px solid #333;">
            
            <h1 style="font-size: 32px; color: #5865F2; margin-bottom: 20px;">Welcome to DevFund, ${name} 👋</h1>
            
            <p style="font-size: 16px; color: #cccccc; line-height: 1.6;">
              We're excited to have you on board!<br /><br />
              DevFund is the place where developers connect, collaborate, and grow together. From open source to career-building, you're in good company.
            </p>

            <div style="margin: 30px 0;">
              <a href="" target="_blank" style="background-color: #5865F2; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
                Get Started
              </a>
            </div>

            <p style="font-size: 14px; color: #999999;">
              Need help or have questions? Just reply to this email or visit our <a href="" style="color: #5865F2; text-decoration: none;">Support Page</a>.
            </p>

            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />

            <footer style="font-size: 12px; color: #808080;">
              <p>&copy; ${new Date().getFullYear()} DevFund. All rights reserved.</p>
              <p>Made with ❤️ by developers, for developers.</p>
            </footer>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to", email);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DevFund Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - DevFund',
      html: `
        <div style="background-color: #121212; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e1e1e; border-radius: 12px; padding: 30px; border: 1px solid #333;">
            <h2 style="color: #FF6B6B;">Password Reset Requested</h2>
            <p style="font-size: 16px; color: #cccccc;">
              We received a request to reset the password for your DevFund account.
            </p>
            <div style="margin: 30px 0;">
              <a href="${resetURL}" target="_blank" style="background-color: #5865F2; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset My Password
              </a>
            </div>
            <p style="font-size: 14px; color: #999999;">
              If you didn’t request this, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />
            <footer style="font-size: 12px; color: #808080;">
              <p>&copy; ${new Date().getFullYear()} DevFund. All rights reserved.</p>
              <p>Stay secure. Stay updated. 🛡️</p>
            </footer>
          </div>
        </div>
      `,
    };

    const response = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return response;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
export const sendResetSuccessEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DevFund" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your DevFund Password Has Been Reset',
      html: `
        <div style="background-color: #f4f4f4; padding: 40px; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #4CAF50; text-align: center;">✅ Password Reset Successful</h2>
            <p style="font-size: 16px; color: #333;">
              Hi there,
            </p>
            <p style="font-size: 16px; color: #333;">
              This is to confirm that your DevFund password has been successfully reset.
            </p>
            <p style="font-size: 16px; color: #333;">
              If you did not perform this action, please contact our support team immediately.
            </p>
            <p style="margin-top: 30px; font-size: 14px; color: #777;">
              Thanks,<br />
              DevFund Team
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Password reset success email sent to", email);
  } catch (error) {
    console.error("❌ Error sending password reset success email:", error.message);
    throw new Error("Failed to send password reset success email");
  }
};