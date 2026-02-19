<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to HomesTV</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f9; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f9;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <!-- Main Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #c10007; padding: 30px;">
                            <img src="https://news.homes.ph/images/HomesTV.png" alt="HomesTV" width="100" style="display: block; max-height: 40px; filter: brightness(0) invert(1); border: 0;" />
                        </td>
                        
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px; color: #1f2937; line-height: 1.6;">
                            <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.025em;">Welcome, {{ $firstName }}!</h1>
                            
                            <p style="margin: 0 0 30px 0; font-size: 16px; color: #4b5563;">
                                Your blogger account has been created on HomesTV. Use the credentials below to access your dashboard:
                            </p>
                            
                            <!-- Credentials Card -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="100" style="font-weight: 600; color: #374151; padding-bottom: 10px;">Email:</td>
                                                <td style="padding-bottom: 10px;">
                                                    <span style="color: #111827; font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 14px;">
                                                        {{ $email }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="100" style="font-weight: 600; color: #374151;">Password:</td>
                                                <td>
                                                    <span style="color: #111827; font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 14px;">
                                                        {{ $password }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 30px 0; font-size: 16px; color: #4b5563;">
                                For security reasons, we strongly recommend that you change your password immediately after your first login.
                            </p>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $loginUrl }}" style="display: inline-block; background-color: #c10007; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 16px;">
                                            Login to Your Account
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                &copy; {{ date('Y') }} HomesTV. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
