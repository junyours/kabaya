<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kabaya Login Credentials</title>
</head>

<body
  style="background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px 0;">

  <!-- Preheader -->
  <div
    style="display: none; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: transparent;">
    Your Kabaya login credentials are ready.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
          style="max-width: 500px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #e11d48; padding: 24px;">
              <span style="color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 2px;">
                KABAYA
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">

              <!-- Title -->
              <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">
                Login Credentials
              </h1>

              <!-- Greeting -->
              <p style="font-size: 14px; line-height: 24px; color: #4b5563; margin: 0 0 16px 0;">
                Hello {{ $name ?? 'there' }},
              </p>

              <p style="font-size: 14px; line-height: 24px; color: #4b5563; margin: 0 0 24px 0;">
                Your Kabaya account has been created successfully.
                Use the login credentials below to access your account.
              </p>

              <!-- Login Credentials Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px;">

                <!-- Username -->
                <tr>
                  <td style="padding: 20px 24px 12px 24px;">

                    <span
                      style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9f1239; font-weight: 600; display: block;">
                      Username
                    </span>

                    <span
                      style="font-size: 17px; font-weight: 600; color: #881337; display: block; margin-top: 6px; word-break: break-all;">
                      {{ $user_name }}
                    </span>

                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 24px;">
                    <div style="height: 1px; background-color: #fecdd3;"></div>
                  </td>
                </tr>

                <!-- Password -->
                <tr>
                  <td style="padding: 12px 24px 20px 24px;">

                    <span
                      style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9f1239; font-weight: 600; display: block;">
                      Temporary Password
                    </span>

                    <span
                      style="font-size: 26px; font-weight: 700; color: #881337; font-family: monospace; letter-spacing: 2px; display: block; margin-top: 8px; word-break: break-all;">
                      {{ $password }}
                    </span>

                  </td>
                </tr>

              </table>

              <!-- Temporary Password Notice -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; margin-top: 20px;">

                <tr>
                  <td style="padding: 14px 16px;">

                    <p style="font-size: 12px; line-height: 18px; color: #92400e; margin: 0;">
                      <strong>Important:</strong> This is a temporary password.
                      Please change your password after your first successful login.
                    </p>

                  </td>
                </tr>

              </table>

              <!-- Login Instructions -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="margin-top: 24px;">

                <tr>
                  <td>

                    <p style="font-size: 13px; line-height: 20px; color: #374151; margin: 0 0 8px 0; font-weight: 600;">
                      How to sign in:
                    </p>

                    <p style="font-size: 12px; line-height: 20px; color: #6b7280; margin: 0;">
                      1. Open the Kabaya application.
                    </p>

                    <p style="font-size: 12px; line-height: 20px; color: #6b7280; margin: 0;">
                      2. Enter your username.
                    </p>

                    <p style="font-size: 12px; line-height: 20px; color: #6b7280; margin: 0;">
                      3. Enter your temporary password.
                    </p>

                    <p style="font-size: 12px; line-height: 20px; color: #6b7280; margin: 0;">
                      4. Follow the instructions in the application to secure your account.
                    </p>

                  </td>
                </tr>

              </table>

              <!-- Security Warning -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; margin-top: 24px; text-align: left;">

                <tr>
                  <td style="padding: 16px;">

                    <p style="font-size: 13px; line-height: 20px; color: #991b1b; margin: 0; font-weight: 600;">
                      Security Warning:
                    </p>

                    <p style="font-size: 12px; line-height: 18px; color: #7f1d1d; margin: 4px 0 0 0;">
                      Do not share your login credentials with anyone.
                      Kabaya staff will <strong>never</strong> ask you to provide
                      your password. If you did not request this account,
                      please contact Kabaya support.
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #f3f4f6; text-align: center;">

              <p style="font-size: 11px; line-height: 18px; color: #9ca3af; margin: 0 0 8px 0;">
                This message was produced and distributed by Kabaya.
              </p>

              <p style="font-size: 11px; color: #9ca3af; margin: 0;">
                © {{ date('Y') }} Kabaya, All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>

</html>