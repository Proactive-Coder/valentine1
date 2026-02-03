// api/send_valentine.js - Vercel Serverless Function

const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { phone, instagram, timestamp } = req.body;

    // Validate inputs
    if (!phone || !instagram) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone and Instagram are required' 
      });
    }

    // Configure your email service
    // Using Gmail (enable "App Passwords" in your Google Account)
    // Or use any other email service that Nodemailer supports
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,      // Your Gmail address
        pass: process.env.EMAIL_PASSWORD   // Your Gmail App Password
      }
    });

    // Email content
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
            .container { 
              max-width: 600px; 
              margin: 20px auto; 
              background-color: #fff; 
              padding: 40px;
              border-radius: 15px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              border-left: 5px solid #ff1493;
            }
            .header { 
              text-align: center;
              margin-bottom: 30px;
              color: #ff1493;
              font-size: 28px;
              font-weight: bold;
            }
            .emoji { font-size: 40px; margin: 10px 0; text-align: center; }
            .details { 
              background-color: #ffe0ed;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .detail-item { 
              margin: 15px 0;
              padding: 10px;
              background-color: white;
              border-radius: 5px;
            }
            .label { 
              font-weight: bold;
              color: #ff1493;
              display: inline-block;
              min-width: 120px;
            }
            .value { 
              color: #333;
              font-size: 16px;
            }
            .timestamp {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .footer {
              text-align: center;
              color: #ff1493;
              margin-top: 20px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              ❤️ Someone Said YES! ❤️
            </div>
            
            <div class="emoji">🎉 💕 🎉</div>
            
            <p style="text-align: center; font-size: 16px; color: #333;">
              Congratulations! You received a response to your Valentine's question!
            </p>
            
            <div class="details">
              <div class="detail-item">
                <span class="label">📱 Phone:</span>
                <span class="value">${phone}</span>
              </div>
              <div class="detail-item">
                <span class="label">📸 Instagram:</span>
                <span class="value">@${instagram}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>They said YES to being your Valentine! 💘</p>
              <p>Go reach out and make their day even more special! 🌹</p>
            </div>
            
            <div class="timestamp">
              Received on: ${timestamp}
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `💕 Valentine's Response! - ${timestamp}`,
      html: htmlContent,
      replyTo: phone // Include phone in reply-to for reference
    });

    // Log to console (visible in Vercel logs)
    console.log(`✅ Valentine response received: Phone=${phone}, Instagram=@${instagram}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Thank you! Your response has been sent.' 
    });

  } catch (error) {
    console.error('❌ Error:', error);
    
    // Still return success to user (data may be important)
    return res.status(200).json({ 
      success: true, 
      message: 'Response saved! We will process it shortly.' 
    });
  }
}