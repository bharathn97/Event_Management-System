import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Check if the request method is not POST
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  // Destructure email details from the request body
  const { to, subject, text } = req.body;

  try {
    // Create a nodemailer transporter with Gmail service and authentication
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bharathnagendrababu@gmail.com', // Replace with your Gmail address
        pass: 'kzen atcv ohrz pwbd', // Replace with your App Password
      },
    });

    // Define email options
    const mailOptions = {
      from: 'bharathnagendrababu@gmail.com',
      to,
      subject,
      text,
    };

    // Send the email using the transporter
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);

    // Respond with success status and message
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    // Log and respond with internal server error for exceptions
    console.error('Error sending email:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
}
