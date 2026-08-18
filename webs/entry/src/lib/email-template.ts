/**
 * Generates email templates with premium styling matching the .de brand
 */
export function generateEmailTemplate({
  title,
  preheader,
  contentHtml,
  ctaText,
  ctaUrl,
}: {
  title: string;
  preheader: string;
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}) {
  const ctaSection = ctaText && ctaUrl
    ? `
      <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
        <tbody>
          <tr>
            <td align="center" style="font-family: 'Fira Sans', sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                <tbody>
                  <tr>
                    <td style="font-family: 'Fira Sans', sans-serif; font-size: 14px; vertical-align: top; border-radius: 8px; text-align: center; background-color: #0072FF;" valign="top" align="center" bgcolor="#0072FF">
                      <a href="${ctaUrl}" target="_blank" style="border: solid 1px #0072FF; border-radius: 8px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 24px; text-decoration: none; text-transform: capitalize; background-color: #0072FF; border-color: #0072FF; color: #ffffff;">${ctaText}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    `
    : "";

  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>${title}</title>
        <style>
          @media only screen and (max-width: 620px) {
            table.body h1 {
              font-size: 28px !important;
              margin-bottom: 10px !important;
            }
            table.body p,
            table.body ul,
            table.body ol,
            table.body td,
            table.body span,
            table.body a {
              font-size: 16px !important;
            }
            table.body .wrapper {
              padding: 10px !important;
            }
            table.body .content {
              padding: 0 !important;
            }
            table.body .container {
              padding: 0 !important;
              width: 100% !important;
            }
            table.body .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important;
            }
            table.body .btn table {
              width: 100% !important;
            }
            table.body .btn a {
              width: 100% !important;
            }
            table.body .img-responsive {
              height: auto !important;
              max-width: 100% !important;
              width: auto !important;
            }
          }
        </style>
      </head>
      <body style="background-color: #030712; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.6; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #F3F4F6;">
        <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">${preheader}</span>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #030712; width: 100%;" width="100%" bgcolor="#030712">
          <tr>
            <td style="font-family: 'Fira Sans', sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
            <td class="container" style="font-family: 'Fira Sans', sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
              <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 20px;">

                <!-- Logo Header -->
                <div style="text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -1px; font-family: 'Fira Sans', sans-serif;">
                    <span style="color: #0072FF;">.d</span>e<span style="color: #6B7280; font-size: 14px; font-weight: 500; margin-left: 6px;">dotentry</span>
                  </span>
                </div>

                <!-- Main Card -->
                <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #0E1629; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; width: 100%;" width="100%">
                  <tr>
                    <td class="wrapper" style="font-family: 'Fira Sans', sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 40px;" valign="top">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tr>
                          <td style="font-family: 'Fira Sans', sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                            <h1 style="color: #ffffff; font-family: 'Fira Sans', sans-serif; font-size: 24px; font-weight: 700; margin: 0; margin-bottom: 24px; line-height: 1.25;">${title}</h1>
                            <div style="color: #9CA3AF; font-family: 'Fira Sans', sans-serif; font-size: 15px; font-weight: normal; margin: 0; margin-bottom: 30px; line-height: 1.6;">
                              ${contentHtml}
                            </div>
                            ${ctaSection}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Footer -->
                <div class="footer" style="clear: both; margin-top: 24px; text-align: center; width: 100%;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                    <tr>
                      <td class="content-block" style="font-family: 'Fira Sans', sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #6B7280; font-size: 12px; text-align: center;" valign="top" align="center">
                        <span class="apple-link" style="color: #6B7280; font-size: 12px; text-align: center;">Developed by <a href="https://www.dotfreelancer.in/" target="_blank" style="color: #0072FF; text-decoration: none; font-weight: bold;">dotfreelancer.in</a></span>
                      </td>
                    </tr>
                  </table>
                </div>

              </div>
            </td>
            <td style="font-family: 'Fira Sans', sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function generateAdminInviteHtml(email: string, addedBy: string, appUrl: string) {
  return generateEmailTemplate({
    title: "Administrator Access Granted",
    preheader: "You have been granted administrator access to the dotentry system.",
    contentHtml: `
      <p>Hello,</p>
      <p>You have been added as an <strong>Administrator</strong> on the <strong>dotentry</strong> system by <strong>${addedBy}</strong>.</p>
      <p>With this access, you can:</p>
      <ul style="padding-left: 20px; margin-bottom: 20px;">
        <li>Create and manage events.</li>
        <li>Upload participant listings (Excel files).</li>
        <li>View live check-in analytics and status metrics.</li>
        <li>Register manual check-ins.</li>
      </ul>
      <p>Please log in using your Google Account corresponding to: <strong>${email}</strong>.</p>
    `,
    ctaText: "Go to Admin Panel",
    ctaUrl: `${appUrl}/admin`,
  });
}

export function generateAdminRevokeHtml(email: string, revokedBy: string) {
  return generateEmailTemplate({
    title: "Administrator Access Revoked",
    preheader: "Your administrator access to dotentry has been revoked.",
    contentHtml: `
      <p>Hello,</p>
      <p>This is to inform you that your administrator privileges on the <strong>dotentry</strong> system have been revoked by <strong>${revokedBy}</strong>.</p>
      <p>You will no longer be able to log in to the admin panel or perform administrative tasks. If you believe this is in error, please contact your Super Administrator.</p>
    `,
  });
}

export function generateEventNotificationHtml(eventName: string, details: string, appUrl: string) {
  return generateEmailTemplate({
    title: "dotentry System Alert",
    preheader: `System notification regarding event: ${eventName}`,
    contentHtml: `
      <p>Hello Admin,</p>
      <p>An event action has been recorded in the dotentry system:</p>
      <div style="background-color: #030712; border: 1px solid rgba(255, 255, 255, 0.08); padding: 15px; border-radius: 8px; margin-bottom: 20px; font-family: 'Fira Code', monospace; font-size: 13px;">
        ${details}
      </div>
      <p>You can view the full details and live check-in statuses by clicking the button below.</p>
    `,
    ctaText: "View Dashboard",
    ctaUrl: `${appUrl}/admin`,
  });
}
