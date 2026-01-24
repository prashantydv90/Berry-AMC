import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

// export const transporter = nodemailer.createTransport({
//   service: "gmail", // or "outlook", "yahoo"

//   auth: {
//     user: process.env.EMAIL_USER, // your email
//     pass: process.env.EMAIL_PASS, // your app password
//   },
// });

// export const transporter = nodemailer.createTransport({
//   host: "smtp.sendgrid.net",
//   port: 587,         // TLS port
//   secure: false,     // true for port 465 (SSL)
//   auth: {
//     user: "apikey",               // literally "apikey"
//     pass: process.env.SENDGRID_API_KEY, // your SendGrid API key
//   },
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000,
// });

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  logger: true,
  debug: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send mail as a Promise
export const sendMail = ({ to, subject, html }) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: `"Berry AMC" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html,
      },
      (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          reject(err);
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      }
    );
  });
};

