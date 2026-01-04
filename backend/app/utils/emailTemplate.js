// utils/emailTemplates.js

export const clientApprovalEmail = (clientName) => {
  return {
    subject: "🎉 Welcome to Berry AMC - Your Client Account is Approved!",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
          
          <h2 style="color: #6D28D9; text-align: center;">Welcome to Berry AMC!</h2>
          <hr style="border: none; height: 2px; background-color: #6D28D9; width: 60px; margin: 15px auto;">

          <p style="font-size: 16px; color: #333;">
            Dear <b>${clientName}</b>,
          </p>

          <p style="font-size: 15px; color: #444; line-height: 1.6;">
            We’re delighted to inform you that your client registration request has been <b>approved</b> 🎉  
            You are now officially a client of <b>Berry AMC</b>.
          </p>

          <p style="font-size: 15px; color: #444; line-height: 1.6;">
            You can now log in to your Berry AMC Client Portal to access your portfolio, view reports, and manage your investments with us.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://berryamc.in/user-dashboard" style="background: #6D28D9; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Go to your Dashboard
            </a>
          </div>

          <p style="font-size: 14px; color: #666;">
            For any assistance, feel free to contact us at  
            <a href="mailto:support@berryamc.in" style="color: #6D28D9;">support@berryamc.com</a>.
          </p>

          <p style="font-size: 14px; color: #888; margin-top: 25px;">
            Best regards,<br>
            <b>The Berry AMC Team</b><br>
            <a href="https://berryamc.in" style="color: #6D28D9; text-decoration: none;">www.berryamc.com</a>
          </p>
        </div>
      </div>
    `,
  };
};




// utils/emailTemplates.js
export const contactEmail = ({ name, email, phone, message }) => {
  return {
    subject: "📩 New Contact Request from Berry AMC Website",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
          
          <h2 style="color: #6D28D9; text-align: center;">New Contact Request</h2>
          <hr style="border: none; height: 2px; background-color: #6D28D9; width: 60px; margin: 15px auto;">

          <p style="font-size: 16px; color: #333;">
            You have received a new contact request via the <b>Berry AMC</b> website.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 30%;">Name</td>
              <td style="padding: 8px;">${name}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Email</td>
              <td style="padding: 8px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Phone</td>
              <td style="padding: 8px;">${phone}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Message</td>
              <td style="padding: 8px;">${message}</td>
            </tr>
          </table>

          <p style="margin-top: 20px; font-size: 14px; color: #555;">
            Please respond to the client as soon as possible.  
            <b>Berry AMC Team</b>
          </p>

          <p style="font-size: 12px; color: #888; margin-top: 25px;">
            This email was generated automatically from the Berry AMC website.
          </p>

        </div>
      </div>
    `,
  };
};
