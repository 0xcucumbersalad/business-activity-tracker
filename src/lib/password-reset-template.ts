export function forgotPasswordEmailTemplate(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
          background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%);
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo {
          width: 64px;
          height: 64px;
          margin-bottom: 24px;
          object-fit: contain;
        }
        .content {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          margin: 0 24px;
        }
        h1 {
          color: #111827;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 16px;
          text-align: center;
        }
        p {
          color: #4B5563;
          font-size: 16px;
          margin: 16px 0;
          text-align: center;
        }
        .button-container {
          text-align: center;
          margin: 32px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06);
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding: 0 24px;
        }
        .divider {
          height: 1px;
          background: #E5E7EB;
          margin: 24px 0;
        }
        .footer-text {
          color: #6B7280;
          font-size: 14px;
        }
        @media only screen and (max-width: 600px) {
          .container {
            padding: 24px 16px;
          }
          .content {
            padding: 24px 16px;
            margin: 0 8px;
          }
          h1 {
            font-size: 22px;
          }
        }
      </style>
    </head>
    <body>
      <div style="padding: 40px 0; background-color: #f5f5f5;">
        <div class="container">
          <div class="header">
            <img src="https://cdn.jwisnetwork.com/logo.png" alt="Company Logo" class="logo" style="width: 64px; height: 64px; margin-bottom: 24px;" />
          </div>
          <div class="content">
            <h1>Forgot your password?</h1>
            <p>No worries!. Click the button below to securely reset your password.</p>
            <div class="button-container">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #6B7280;">If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <div class="divider"></div>
            <p class="footer-text">This email was sent by Lapagan Inc.<br>Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
